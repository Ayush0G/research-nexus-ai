#!/usr/bin/env python3
"""Scan git history and codebase for hardcoded secrets, API keys, and passwords."""

import re
import subprocess
import sys

PATTERNS = [
    (r"AIza[0-9A-Za-z_-]{35}", "Google API Key"),
    (r"sk-[0-9A-Za-z]{32,}", "OpenAI API Key"),
    (r"ghp_[0-9A-Za-z]{36}", "GitHub Personal Access Token"),
    (r"xox[baprs]-[0-9A-Za-z-]+", "Slack Token"),
    (r"(?i)(password|passwd|pwd)\s*[:=]\s*['\"][^'\"]+['\"]", "Hardcoded Password"),
    (r"(?i)(secret|api_key|apikey)\s*[:=]\s*['\"][^'\"]+['\"]", "Hardcoded Secret"),
    (r"(?i)mongodb(\+srv)?://[^\s]+", "MongoDB Connection String"),
    (r"(?i)postgres(ql)?://[^\s]+", "PostgreSQL Connection String"),
]

FILE_EXTENSIONS = {".py", ".js", ".ts", ".tsx", ".jsx", ".env", ".yml", ".yaml", ".json", ".toml", ".cfg", ".ini"}
IGNORE_DIRS = {"node_modules", ".venv", "venv", "__pycache__", ".git", ".next", "dist", "build"}


def scan_files():
    issues = []
    for root, dirs, files in __import__("os").walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for fname in files:
            ext = __import__("os").path.splitext(fname)[1]
            if ext not in FILE_EXTENSIONS:
                continue
            fpath = __import__("os").path.join(root, fname)
            try:
                with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                    for i, line in enumerate(f, 1):
                        for pattern, label in PATTERNS:
                            if re.search(pattern, line):
                                issues.append((fpath, i, label, line.strip()[:80]))
            except Exception:
                pass
    return issues


def scan_git_history():
    issues = []
    try:
        result = subprocess.run(
            ["git", "log", "--all", "--diff-filter=A", "--name-only", "--pretty=format:"],
            capture_output=True, text=True, timeout=30
        )
        for line in result.stdout.splitlines():
            if ".env" in line and "example" not in line:
                issues.append(("git-history", 0, "Sensitive file in git history", line))
    except Exception:
        pass
    return issues


def main():
    print("=" * 60)
    print("SECRET SCAN REPORT")
    print("=" * 60)

    file_issues = scan_files()
    git_issues = scan_git_history()
    all_issues = file_issues + git_issues

    if not all_issues:
        print("\n[OK] No secrets found in codebase.\n")
        return 0

    print(f"\n[WARN] Found {len(all_issues)} potential issue(s):\n")
    for path, line, label, snippet in all_issues:
        print(f"  {label}")
        print(f"    File: {path}:{line}")
        print(f"    Snippet: {snippet[:60]}...")
        print()

    return 1


if __name__ == "__main__":
    sys.exit(main())
