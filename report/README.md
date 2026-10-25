# Skill Connect — Seminar-I Project Report (LaTeX)

This directory contains the complete **Seminar-I Project Report** for **Skill Connect**, formatted to match the exact institutional style, typography, and chapter organization used at **Sanjivani University (Department of Computer Science and Engineering)**.

---

## File Location
- **`report/skill_connect_report.tex`**

---

## Report Structure & Highlights

The report includes all 8 core chapters, matching the exact format of the reference report:

1. **Title Page**: Sanjivani University, Department of CSE, Project Title, Student Names, Guide, HOD.
2. **Abstract**: Comprehensive summary with keywords.
3. **Table of Contents (TOC), List of Figures, List of Tables**.
4. **Chapter 1: Introduction**: Background, Motivation, Project Vision, Scope of the Project.
5. **Chapter 2: Problem Statement, Objectives and Scope**: Core problem definition, 10 specific objectives, expected outcomes.
6. **Chapter 3: Literature Review and Research Gap**: Peer-to-peer pedagogy (Protégé Effect), campus LMS limitations, recommendation heuristics, micro-mentoring, and identified research gap.
7. **Chapter 4: Proposed Methodology**: Engineering lifecycle, UI/UX tokens, React 19 stack, client state persistence, future backend specifications, **TikZ System Workflow Diagram (Figure 4.1)**, and **TikZ Layered Architecture Diagram (Figure 4.2)**.
8. **Chapter 5: Implementation**: Detailed walkthrough of all 11 modules:
   - Login & Authentication
   - 4-Step Onboarding Wizard
   - Dashboard & Skill Snapshot Metrics
   - Smart Peer Matching Matrix
   - Campus Circles (Communities) & Discussions
   - Peer Learning Sessions & August Interactive Calendar
   - Peer-to-Peer Chat
   - Campus Skill Demand Polls
   - Global Command Palette (`⌘K` Search Overlay)
   - Profile Customizer & Barter Manager
9. **Chapter 6: Testing and Results**: Testing methodology, 10 functional test cases (Table 6.1), and current validation results.
10. **Chapter 7: Advantages, Limitations and Future Scope**: Detailed strengths, limitations, and future roadmap (WebRTC rooms, dynamic QR attendance, AI embeddings, cross-campus federation, PWA offline sync).
11. **Chapter 8: Conclusion**.
12. **Bibliography**: Formatted academic citations.
13. **Signatures Page**: Signature lines for Project Guide and Head of Department (Dr. Mahendra Gawali).

---

## How to Customize Student Names & Roll Numbers

At the top of `skill_connect_report.tex` (lines 53–65), you can edit your group's details:

```latex
\newcommand{\StudentOne}{[Your Name] -- [Your PRN]}
\newcommand{\StudentTwo}{[Partner Name 2] -- [PRN 2]}
\newcommand{\StudentThree}{[Partner Name 3] -- [PRN 3]}
\newcommand{\StudentFour}{[Partner Name 4] -- [PRN 4]}
\newcommand{\GuideName}{Prof. Jyotimoyee Kalita}
\newcommand{\HODName}{Dr. Mahendra Gawali}
\newcommand{\AcademicYear}{2026--2027}
```

---

## How to Compile into PDF

### Option A: Using Overleaf (Recommended — 1 Click)
1. Go to [https://www.overleaf.com/](https://www.overleaf.com/) and create a new blank project.
2. Open `report/skill_connect_report.tex`, copy the entire code, and paste it into Overleaf's `main.tex`.
3. Click **Recompile**.
4. Download your formatted PDF!

### Option B: Local LaTeX (VS Code / TeXstudio / MiKTeX)
Run:
```bash
pdflatex skill_connect_report.tex
pdflatex skill_connect_report.tex   # Run twice to generate TOC and references
```
