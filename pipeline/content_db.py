"""Content Database — SQLite content queue for the SEO pipeline.

Tracks every article from keyword discovery → generation → published.
Ensures we never duplicate content or exceed the generation schedule.
"""

import sqlite3
import json
from datetime import datetime, timedelta
from typing import Optional
from pathlib import Path


DB_PATH = Path(__file__).parent.parent / "content.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database schema. Safe to call repeatedly."""
    with get_conn() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS keywords (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                keyword     TEXT NOT NULL UNIQUE,
                cluster     TEXT,
                volume      INTEGER DEFAULT 0,
                difficulty  INTEGER DEFAULT 0,
                intent      TEXT DEFAULT 'informational',
                source      TEXT DEFAULT 'seed',
                discovered_at TEXT DEFAULT (datetime('now')),
                status      TEXT DEFAULT 'pending'
                    CHECK(status IN ('pending','researched','generated','published','failed'))
            );

            CREATE TABLE IF NOT EXISTS articles (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                keyword_id  INTEGER REFERENCES keywords(id),
                slug        TEXT NOT NULL UNIQUE,
                title       TEXT NOT NULL,
                content     TEXT NOT NULL,
                excerpt     TEXT,
                content_type TEXT DEFAULT 'guide'
                    CHECK(content_type IN ('roundup','comparison','guide','listicle','review')),
                word_count  INTEGER DEFAULT 0,
                meta_description TEXT,
                schema_json TEXT,
                affiliate_links TEXT,  -- JSON array: [{"url":"...","text":"..."}]
                internal_links TEXT,   -- JSON array
                status      TEXT DEFAULT 'draft'
                    CHECK(status IN ('draft','reviewed','published','archived')),
                published_at TEXT,
                created_at  TEXT DEFAULT (datetime('now')),
                updated_at  TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS rank_tracking (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id  INTEGER REFERENCES articles(id),
                keyword     TEXT NOT NULL,
                position    INTEGER,
                search_volume INTEGER DEFAULT 0,
                checked_at  TEXT DEFAULT (datetime('now'))
            );

            CREATE INDEX IF NOT EXISTS idx_keywords_status ON keywords(status);
            CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
            CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
        """)


# ── Keyword operations ──────────────────────────────────────────────

def add_keyword(keyword: str, cluster: str = None, source: str = "seed",
                volume: int = 0, difficulty: int = 0) -> bool:
    """Add a keyword to the queue. Returns True if new, False if existed."""
    with get_conn() as conn:
        try:
            conn.execute(
                """INSERT INTO keywords (keyword, cluster, source, volume, difficulty)
                   VALUES (?, ?, ?, ?, ?)""",
                (keyword, cluster, source, volume, difficulty)
            )
            return True
        except sqlite3.IntegrityError:
            return False


def get_pending_keywords(limit: int = 10) -> list:
    """Get keywords ready for content generation."""
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT * FROM keywords
               WHERE status = 'pending'
               ORDER BY volume DESC, difficulty ASC
               LIMIT ?""",
            (limit,)
        ).fetchall()
        return [dict(r) for r in rows]


def mark_keyword_status(keyword_id: int, status: str):
    with get_conn() as conn:
        conn.execute("UPDATE keywords SET status = ? WHERE id = ?",
                     (status, keyword_id))


# ── Article operations ──────────────────────────────────────────────

def insert_article(keyword_id: int, slug: str, title: str, content: str,
                   content_type: str, excerpt: str = "",
                   meta_description: str = "", word_count: int = 0,
                   schema_json: str = "",
                   affiliate_links: list = None) -> int:
    affiliate_json = json.dumps(affiliate_links or [])
    with get_conn() as conn:
        cur = conn.execute(
            """INSERT INTO articles
               (keyword_id, slug, title, content, content_type, excerpt,
                meta_description, word_count, schema_json, affiliate_links)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (keyword_id, slug, title, content, content_type, excerpt,
             meta_description, word_count, schema_json, affiliate_json)
        )
        return cur.lastrowid


def get_articles_by_status(status: str, limit: int = 50) -> list:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM articles WHERE status = ? ORDER BY created_at DESC LIMIT ?",
            (status, limit)
        ).fetchall()
        return [dict(r) for r in rows]


def get_published_articles() -> list:
    """Get all published articles for sitemap / interlinking."""
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC"
        ).fetchall()
        return [dict(r) for r in rows]


def publish_article(article_id: int):
    with get_conn() as conn:
        conn.execute(
            """UPDATE articles SET status = 'published',
               published_at = datetime('now'),
               updated_at = datetime('now')
               WHERE id = ?""",
            (article_id,)
        )
        # Also update the keyword status
        conn.execute("""UPDATE keywords SET status = 'published'
                       WHERE id = (SELECT keyword_id FROM articles WHERE id = ?)""",
                     (article_id,))


def get_stale_articles(days: int = 180) -> list:
    """Find articles that haven't been updated in N days."""
    cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM articles WHERE updated_at < ? AND status = 'published'",
            (cutoff,)
        ).fetchall()
        return [dict(r) for r in rows]


def get_stats() -> dict:
    """Quick dashboard stats."""
    with get_conn() as conn:
        total_articles = conn.execute(
            "SELECT COUNT(*) FROM articles"
        ).fetchone()[0]
        published = conn.execute(
            "SELECT COUNT(*) FROM articles WHERE status = 'published'"
        ).fetchone()[0]
        pending_keywords = conn.execute(
            "SELECT COUNT(*) FROM keywords WHERE status = 'pending'"
        ).fetchone()[0]
        total_words = conn.execute(
            "SELECT COALESCE(SUM(word_count), 0) FROM articles WHERE status = 'published'"
        ).fetchone()[0]
        return {
            "total_articles": total_articles,
            "published": published,
            "pending_keywords": pending_keywords,
            "total_words_published": total_words,
        }


# ── Init ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    print("✓ Content database initialized at:", DB_PATH)