---
name: issue-to-pr
description: GitHub 이슈로 등록된 요구사항을 읽어 구현한 뒤 "개발자 확인"에서 멈추고, 개발자가 승인하면 그때 GitHub MCP로 브랜치·커밋·푸시·PR·이슈 코멘트를 올린다. "이슈 번호로 개발", "이 요구사항 구현해줘", "이슈 읽고 개발", "확인했으니 PR 올려줘" 같은 요청에서 사용.
---

# Issue → 개발 →〔개발자 확인〕→ Commit/Push/PR 워크플로

GitHub 이슈의 요구사항을 구현하고, **개발자 확인을 거친 뒤에만** 형상관리(브랜치·
커밋·푸시·PR)를 진행하는 2단계 절차다. 개발과 PR을 한 번에 진행하지 않는다.

## 기본값 (이 프로젝트)
- 레포: `Client-Engineering-Korea/IBM-BANK-PLATFORM`
- 기본 브랜치: `main`
- 커밋/푸시/PR: **GitHub MCP API** 사용 (로컬 git 미사용)
- 백엔드 API: `https://ibm-corebanking.2alcc5emod4t.us-south.codeengine.appdomain.cloud`
- 참고 코드: `services/teller-cli/teller_client.py`

> 사용자가 다른 레포/브랜치/이슈를 지정하면 그 값을 우선한다.

## 전제
- GitHub MCP가 연결되어 있어야 한다 (없으면 사용자에게 연결을 요청).
- 이 스킬은 **Advanced mode**에서만 동작한다.

## 개발 모드 권장 (Carbon UI 품질)
- PHASE 1(개발)이 **프론트엔드/Carbon UI**라면, Carbon 컴포넌트 품질을 위해
  **Carbon React Mode + IBM Carbon MCP**에서 개발하는 것을 권장한다.
- 단, 이 스킬은 Advanced mode 전용이므로 스킬이 모드를 직접 전환하지는 못한다.
  현실적 운영:
  - (권장) **Carbon React Mode에서 개발을 끝낸 뒤**, Advanced mode로 전환해 이
    스킬을 **PHASE 2(형상관리)부터** 호출한다.
  - 또는 **Orchestrator 모드**로 워크플로를 돌려, 개발 서브태스크를 Carbon React
    Mode에 위임하게 한다. (동작은 환경에 따라 다르니 데모 전 드라이런으로 확인)
- PHASE 1을 Advanced mode에서 직접 진행해야 한다면, Carbon Design System
  컴포넌트·디자인 토큰·접근성 규칙을 따르도록 구현한다(모드 전환 대안).

## 동작 원칙 (중요)
- **PHASE 1(개발)과 PHASE 2(PR)는 분리되어 있다.** PHASE 1을 마치면 반드시
  멈추고, 개발자의 명시적 승인을 기다린다. 승인 전에는 브랜치/커밋/푸시/PR을
  **절대 만들지 않는다.**
- 호출 시점으로 단계를 판단한다:
  - "이슈 읽고 개발/구현해줘" → **PHASE 1**만 수행하고 확인을 요청하며 멈춘다.
  - "확인했어 / 좋아, PR 올려줘 / 커밋·푸시해줘" → **PHASE 2**만 수행한다.
  - 이미 다른 모드/세션에서 개발이 끝난 상태로 호출되면 PHASE 1은 건너뛰고
    변경분을 파악해 바로 PHASE 2로 간다.

---

## PHASE 1 — 이슈 읽기 → 개발 (여기서 멈춤)

<Steps>

<Step>
**요구사항(이슈) 읽기.** 사용자가 이슈 번호를 주면 GitHub MCP `get_issue`로 본문을
가져온다. 번호가 없으면 `list_issues`로 열린 이슈를 보여주고 어떤 이슈인지 확인한다.
이슈 본문의 Acceptance Criteria / Done 조건을 **체크리스트로 정리**해 요약한다.
</Step>

<Step>
**구현 계획 수립.** 만들/수정할 파일과 접근 방식을 짧게 정리한다. 기존 코드베이스의
구조·컨벤션을 먼저 파악하고 그 안에서 작업한다. (예: 프론트엔드는 `apps/teller-web`,
API 참고는 `services/teller-cli`)
</Step>

<Step>
**개발.** 계획대로 코드를 구현한다. Acceptance Criteria의 각 항목을 충족하도록
작업하고, 가능한 경우 빌드/실행으로 동작을 확인한다.
</Step>

<Step>
**🛑 개발자 확인 요청 (게이트).** 여기서 **멈춘다.** 다음을 정리해 보고한 뒤
개발자의 검토·승인을 요청한다:
- 변경/추가한 파일 목록과 핵심 변경 요약
- Acceptance Criteria 충족 여부 체크리스트
- (있다면) 빌드/실행/테스트 결과
그리고 이렇게 안내한다: **"검토 후 진행해도 되면 알려주세요. 승인하시면 브랜치
생성 → 커밋/푸시 → PR을 올리겠습니다."**
→ 개발자의 명시적 승인이 오기 전까지 **브랜치/커밋/푸시/PR을 만들지 않는다.**
</Step>

</Steps>

---

## PHASE 2 — 개발자 승인 후: Commit/Push/PR

> ⚠️ 이 단계는 **개발자가 명시적으로 승인한 경우에만** 실행한다.

<Steps>

<Step>
**작업 브랜치 생성.** GitHub MCP `create_branch`로 `main`에서 작업 브랜치를 만든다.
이름은 `feature/<짧은-설명>` 또는 `feature/issue-<번호>` 형식.
</Step>

<Step>
**커밋 & 푸시.** 변경/추가된 파일을 GitHub MCP `push_files`로 **하나의 커밋**으로
해당 브랜치에 푸시한다. 커밋 메시지 규칙:
- 제목: `<type>(<scope>): <요약>` (예: `feat(teller-web): 거래 내역 CSV 내보내기`)
- 본문 마지막 줄에 `Closes #<이슈번호>` 를 넣어 PR 머지 시 이슈가 자동으로 닫히게 한다.
</Step>

<Step>
**Pull Request 생성.** GitHub MCP `create_pull_request`로 작업 브랜치 → `main` PR을
연다. PR 본문에는 (1) 무엇을 왜 했는지 요약, (2) Acceptance Criteria 충족 체크리스트,
(3) `Closes #<이슈번호>` 를 포함한다.
</Step>

<Step>
**이슈 코멘트.** GitHub MCP `add_issue_comment`로 해당 이슈에 진행 상황과 생성된
PR 링크를 남긴다.
</Step>

<Step>
**마무리 보고.** 생성한 브랜치명, 커밋, PR 링크, 닫힐 이슈 번호를 한눈에 정리해
보고한다.
</Step>

</Steps>

## 주의
- 도구 이름(`get_issue`, `create_branch`, `push_files`, `create_pull_request`,
  `add_issue_comment`)은 GitHub MCP 서버 버전에 따라 다를 수 있다. 의미가 같은
  도구를 선택해 동일한 흐름을 수행한다.
- 시크릿/토큰을 코드나 커밋에 절대 포함하지 않는다.
- 기존 동작을 깨지 않도록 변경 범위를 최소화한다.
