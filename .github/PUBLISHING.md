# 배포 가이드

이 문서는 `blob-to-url` 패키지를 npm에 배포하는 방법을 설명합니다.

## npm 토큰 설정하기

GitHub Actions 워크플로우에서 npm 패키지를 자동으로 배포하려면 npm 액세스 토큰이 필요합니다:

1. npm 계정에서 액세스 토큰 생성하기:
   - [npm 웹사이트](https://www.npmjs.com/)에 로그인합니다.
   - 우측 상단의 프로필 아이콘 클릭 → 'Access Tokens'를 선택합니다.
   - "Generate New Token" 버튼을 클릭합니다.
   - 토큰 유형으로 "Automation"을 선택합니다.
   - 토큰을 생성하고 안전한 곳에 저장합니다.

2. GitHub 저장소에 시크릿으로 토큰 추가하기:
   - GitHub 저장소 페이지에서 'Settings' 탭으로 이동합니다.
   - 왼쪽 메뉴에서 'Secrets and variables' > 'Actions'를 선택합니다.
   - "New repository secret" 버튼을 클릭합니다.
   - 이름은 `NPM_TOKEN`으로 설정하고, 값에는 1단계에서 생성한 npm 토큰을 입력합니다.
   - "Add secret" 버튼을 클릭합니다.

## 릴리스 프로세스

새 버전 릴리스는 두 가지 방법으로 가능합니다:

### 1. 자동 릴리스 (GitHub Actions 워크플로우 사용)

1. GitHub 저장소 페이지에서 'Actions' 탭으로 이동합니다.
2. 왼쪽 워크플로우 목록에서 'Release'를 선택합니다.
3. "Run workflow" 버튼을 클릭합니다.
4. 릴리스 유형 선택 (patch, minor, major):
   - `patch`: 버그 수정과 사소한 변경 (예: 0.2.4 → 0.2.5)
   - `minor`: 하위 호환성을 유지하는 새 기능 추가 (예: 0.2.4 → 0.3.0)
   - `major`: 주요 변경 사항 및 호환성이 깨지는 수정 (예: 0.2.4 → 1.0.0)
5. "Run workflow" 버튼을 클릭하여 릴리스 프로세스를 시작합니다.

워크플로우는 다음 작업을 자동으로 수행합니다:
- 버전 번호 증가
- 패키지 빌드 및 테스트
- 변경사항 커밋 및 태그 생성
- GitHub 릴리스 생성
- npm에 패키지 배포

### 2. 수동 릴리스

1. 로컬에서 변경 사항을 커밋합니다.
2. 버전 번호를 업데이트합니다: `npm version patch|minor|major`
3. 변경 사항을 GitHub에 푸시합니다: `git push && git push --tags`
4. GitHub Actions 워크플로우가 자동으로 실행되어 패키지를 npm에 배포합니다.

## 문제 해결

배포 중 문제가 발생하면:

1. GitHub Actions 로그를 확인합니다.
2. npm 토큰이 올바르게 설정되었는지 확인합니다.
3. 패키지 버전이 npm에 이미 존재하는지 확인합니다 (중복된 버전은 배포할 수 없습니다). 