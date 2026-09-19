# GitHub Issue-Driven Development Workflow

このプロジェクト（UI Prompt Studio）の開発は、基本的に **GitHub Issue をベースに進めます**。

## 基本ルール
1. **タスクの明確化**: 機能開発、バグ修正、リファクタリング等の作業を行う際は、対応する GitHub Issue を確認（存在しない場合は作成）してから着手する。
2. **コンテキストの保護**: Issue にタスクの要件、進捗、設計判断を記録し、限られたコンテキストウィンドウ内でもスムーズに開発が継続できるようにする。
3. **ブランチとコミット**: 作業ブランチを作成する際は `feature/issue-{number}-{description}` や `fix/issue-{number}-{description}` の命名規則を推奨する。
4. **コミットメッセージ**: `feat: #1 setup project with vite and vuetify` のように Issue 番号を関連付ける。
5. **完了時のクローズ**: タスク完了時には Issue をクローズ、または PR に `Closes #{number}` を記載する。
