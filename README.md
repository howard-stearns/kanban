# Kanban Technical Test

> Synopsis: A basic kanban board in React Native, as a "Take-home test" for employment.

> Status: ??

## Concept

A project brief is presented (see [Appendix: Original Project Brief](#appendix-original-project-brief)). Employer wants to see how I approach it.

### Background

It's hard for an employer to see _whether_ someone can technically do the work requried. Harder still to see _if_ they will do the work, and _how_ they will approach representative problems. Programming exercises, order-of-complexity tests, and math puzzles do not necessarilly capture this. 

Meanwhile, Kanban boards are recognized by technical users. (See e.g., (Trello)[https://www.youtube.com/watch?v=xky48zyL9iA).)

### Opportunity

A one-day task shows a certain level of commitment. Completing it against technical difficulties shows persistence. Moreover, it shows how someone approaches a problem. 

_In my case, I have had good results creating this form of "Vision and Scope" document at the start of a project, usually preceeded by a prototype in order to realistically identify the risks._

### Business Needs

A sense of knowing if and how the candidate will work in the employers environment.

### User Needs

The user is abstract in this case, but let us say that anyone whose used a kanban board

### Business Risks

For the Kanban board, the chief risk is not having something usable and performant. In particuar:
- Scale has been identified as a chief requirement.
- The use of AI to get/speed results is hinted at in the brief, and is important in the context of this employer. However, getting good code results from AI is difficult to do consistently.

For the high-level goal of employment, the chief risk to the business is in misidentifying the results, such that the employee doesn't perform well in the employers environment.

## High Level Description

### Vision

The provided brief calls out two items -- scale and the use of AI -- that can be difficult. In particular, I was not confident of AI results, so I tried some things out as a sort of pre-project prototype (consistent with the way I like to approach projects):

1. I tried an [Auftragstaktik](https://en.wikipedia.org/wiki/Mission-type_tactics) approach with ChatGPT, in which I described the result I wanted, and let it complete the task. (See [viewport.txt](../docs/viewport.)) In the prompt, I gave it a basic model and some jasmine unit tests to illustrate how the model worked. The results were garbage. I tried and failed to have the AI fix it with further instructions (see doc), which also failed. In particular, it completely failed to use any "infinite scroll" techniques, as is vital for the performance aspects of the project.
2. So I concluded that I had to be more presecriptive in telling the AI how to proceed. I thought I must complete the key "infinite scroll" aspects myself and then tell the AI to simply rewrite it as a React Native app. At the same time, Anthropic came out with a new version of Claude that was intended to perform better for coding.
   - I used the W3C standard IntersectionObserver to implement infinite scrolling. I ran into technical difficulties with someone flicks a trackpad fast enough that Chrome keeps emmitting many scroll messages after the user has stopped, and spent _way too much time_ working around that_. But in any case, I now had a proper infinite scroll mechanism, captured in my model objects.
   - Having never used React _Native_ before, I had mistakenly assumed that it supported browser standards, as React would under the hood. (I assumed it was wrapping a Web View, or included Chromium like Electron.) As it turns out, React Native does not support IntersectionObserver at all! Fortunately, Claude understood what I was after, and did the right thing with React Native's built-in FlatList. (_This is a good example of why prototyping is so important before the project's kickoff._)
   - Interestingly, it recognized that I was building a Kanban board. _The only place I had used that word was in the name of the unit tests suite for the models._.
   - The results needed some minor fixes to run at all, but basically did the right thing.
   
The plan then, is to work with Claude to refine that result.

### Minimum Viable Product

See Core Requirements of (Appendix: Original project Brief)[#appendix-original-project-brief].

### Stretch

See Core Requirements of (Appendix: Original project Brief)[#appendix-original-project-brief].

### Exclusions

(_This key section lists things that a stakeholder might reasonably expect from a project, but which is not covered in the Release milestones. They are often opportunities for follow on work, or sometimes, causes stakeholders to require changes to the project before a kickoff is approved._)

**No Web** - Becaue the solution is built around FlatList, which is specific to React _Native_, it is not entriely simple to generalize this to either React or to other Web-specific frameworks (such as Svelte, Lit, etc.).

**UX** - I work closely and interactively with UX or Interaction Designer professionals, but I myself am the last person you want designing the flow or look-and-feel of your interface. In this project, with new UX buddy, I'm just letting the defaults ride. In the past, I've been well-served by aassuming Material Design Web, or Material Design Lite for prototyping, but I don't want to presume that the company is on-board with this, and I also don't want to complicate my first foray into React _Native_ by presuming they play well together. (E.g., React for the Web has it's own derivative of Material Design that is not quite compatible.)

### Release

Due December 26.

### Risks, Dependencies, and Security

Can Claude take the result from prototyping and incrementally add the additional features? (**High Risk**. Should have been mitigated by further prototyping, but I did not have time.)

## Technical Description

> What, exactly, is to be done? Who will do it? How long will it take? Define some internal milestones - specific observeable deliverables such as PRs or tests - that define sync points between multiple people's parts of the project, and which allow you to gauge if you're on track for schedule, and on track for demonstrating that the vision will work. By allowing for early detection of issues or even failure, you make it acceptable to take greater risks and have more ambitious goals.

_In this case, I haven't done enough prep work to sketch this out._


## Apendix: Original Project Brief

### Technical Take-Home Assignment: Kanban App Development

### Description
Develop a Kanban app in React Native that allows users to:

- Add tasks with metadata.
- Move tasks between different sections of the board.
- Perform metadata operations like filtering and sorting.
- React Native 0.76
- Expo allowed for build setup

You are encouraged to use AI tools - GPT, Cursor, etc. to develop this.

### Deliverables

Please commit your code to a Git repo and share with `ommitted here`.

Please record your development process, design choices and time spent on each section in the README of your repo

### Timeframe

Implementation Time: Approximately 6-8 hours. 

### Requirements

**Core Features**

- Configurable Sections:
  - Implement stages for tasks (e.g., To Do, Doing, Review, Done) that are configurable.
- Drag and Drop Functionality:
  - Enable smooth and snappy animations when moving tasks between sections.
- Task Creation UI:
  -Allow users to add tasks with metadata such as name, description, date, priority, assignee, etc.
- Task Detail View:
  - Enable tapping on tasks to view detailed information.
- Metadata Filtering:
  - Allow filtering of tasks across all stages by metadata (e.g., all tasks due after a certain date).
- Responsive UI:
  - Ensure the app works seamlessly in both landscape and portrait orientations.
- Performance:
  - Optimize for large numbers of tasks (support at least 1,000 tasks simultaneously).

**Data Setup**

- Mock API:
  - Create a mock API to fetch tasks from a backend.
  - Support a configurable number of tasks to test scalability.
  - Supports realistic delays from a live backend (to test asynchronous/optimistic updates)

**Advanced Features (Optional but Encouraged)**

- Testing:
  - Implement basic testing to ensure functionality works as intended
- Calendar View Integration:
  - Incorporate a calendar view to display tasks over time
- Enhanced Animations:
  - Implement engaging animations and effects for user interactions
- Error Handling:
  - Provide user-friendly error messages and handle exceptions gracefully
- Observability and logging:
  - Implement logs to observe user behavior and improve bottlenecks 

**Evaluation Criteria**

- Architectural Cleanliness and Code quality
  - Clean, Clear, functional, and extensible architecture.
- Scoping and time management
  - Making tradeoffs between complexity and product requirements of a Kanban App.
- Attention to Detail
  - Polished UI with consistent theming, alignment, and spacing.
  - Thoughtful micro-interactions that enhance usability.
- Technical Mastery
  - Demonstration of advanced React Native features.
  - Appropriate use of third-party libraries.
  - Adherence to React Native best practices for performance and code structure.
- Documentation
  - Well-commented code.
  - Include a README with setup and run instructions.

