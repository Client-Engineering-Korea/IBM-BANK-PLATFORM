# 커밋 / 브랜치 / PR 컨벤션

코드를 커밋·푸시·PR할 때 항상 아래 규칙을 따른다. (GitHub MCP API를 통한
커밋/푸시에도 동일하게 적용)

## 커밋 메시지 — Conventional Commits

형식: `<type>(<scope>): <요약>`

- 제목은 명령형, 72자 이내, 끝에 마침표 없음.
- `type`: `feat`(기능) · `fix`(버그) · `docs` · `refactor` · `test` · `chore` · `perf` · `style` · `build` · `ci`
- `scope`: 변경 영역 (예: `teller-web`, `core-banking-api`, `data-platform`)
- 본문(선택): 무엇을 왜 바꿨는지. 줄당 72자 내외.
- 이슈 연결: 본문 마지막 줄에 `Closes #<번호>` (또는 `Refs #<번호>`)를 넣어
  PR 머지 시 이슈가 자동으로 닫히게 한다.

예시:
```
feat(teller-web): 거래 내역 CSV 내보내기 추가

현재 정렬·필터 상태를 반영해 CSV로 내보낸다. 파일명은
transactions_<IBAN>_<YYYYMMDD>.csv.

Closes #12
```

## 브랜치 이름
- 형식: `<type>/<짧은-설명>` 또는 `<type>/issue-<번호>`
  (예: `feature/teller-web-csv-export`, `fix/issue-12`)
- 기본 브랜치는 `main`. main에 직접 커밋하지 않고 항상 브랜치 → PR.

## Pull Request
- 제목은 커밋 제목과 동일한 컨벤션을 따른다.
- 본문에 포함: (1) 변경 요약(무엇/왜), (2) 요구사항·Acceptance Criteria 충족
  체크리스트, (3) `Closes #<번호>`.
- 가능하면 작은 단위로 나눠 리뷰 가능한 크기로 유지한다.

## 금지
- 시크릿·토큰·자격증명을 커밋에 절대 포함하지 않는다.
- 의미 없는 메시지(`update`, `fix`, `wip` 단독) 사용 금지.
