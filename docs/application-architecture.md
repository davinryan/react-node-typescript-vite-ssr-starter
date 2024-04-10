## Application Architecture

### Feature module based structure.

Based on https://profy.dev/article/react-folder-structure

---
## Feature driven module based structure (FDMBS)

**Decision**
To use, as a 'sensible default', a feature driven module based structure for organising code

Recommended structure example - inspired by https://profy.dev/article/react-folder-structure - in the case of a TODO list application
that has the following domain objects: Todo Todolist, Project

* Module based development structure - see todoList below
* Feature driven structure - refer feature folder below
* AD: Atomic design - https://atomicdesign.bradfrost.com/chapter-2/
* Future reading: ADRs (architecture decision records - https://adr.github.io/)

e.g. 
```
└── src/
    ├── features/ (not a candidate for re-use)
    │   │   # the todo "feature" contains everything related to todos (components/containers AD: organisms)
    │   ├── todos/
    │   │   │   # this is used to export the relevant modules aka the public API (more on that in a bit)
    │   │   ├── index.ts
    │   │   ├── createTodoForm/
    │   │   ├── editTodoModal/
    │   │   ├── todoForm/
    │   │   └── todoList/
    │   │       │   # the public API of the component (exports the todo-list component and hook/reducer/selector)
    │   │       ├── index.ts
    │   │       ├── todoItem.component.ts
    │   │       ├── todoItem.component.unit.ts
    │   │       ├── todoList.component.ts
    │   │       ├── todoList.component.unit.ts
    │   │       ├── todoList.context.ts
    │   │       ├── todoList.reducers.ts
    │   │       ├── todoList.reducers.unit.ts
    │   │       ├── todoList.selectors.ts
    │   │       ├── todoList.selectors.unit.ts
    │   │       ├── todoList.hooks.ts
    │   │       ├── todoList.hooks.unit.ts
    │   │       └── todoList.social.ts
    │   ├── projects/ (AD: Templates, candidate for re-use)
    │   │   ├── index.ts
    │   │   ├── createProjectForm/
    │   │   └── projectList/
    │   ├── ui/ (AD: atoms / molecules , candidates for re-use/component-library)
    │   │   ├── index.ts
    │   │   ├── button/
    │   │   ├── card/
    │   │   ├── checkbox/
    │   │   ├── header/
    │   │   ├── footer/
    │   │   ├── modal/
    │   │   └── text-field/
    │   └── users/ (AD: organisms, candidate for re-use)
    │       ├── index.ts
    │       ├── login/
    │       ├── signup/
    │       └── withAuth/ (higher order function)
    ├── pages/ (AD: pages)
    │   │   # all that's left in the pages folder are simple JS files
    │   │   # each file represents a page (like Next.ts)
    │   ├── createProject.ts
    │   ├── createTodo.ts
    │   ├── index.ts
    │   ├── login.ts
    │   ├── privacy.ts
    │   ├── project.ts
    │   ├── signup.ts
    │   └── terms.ts
    └── services/api/ (candidates for re-use, Edges - whenever we communicate with the outside ACL: anti-corruption layers to avoid technical debt)
        │   # clients or SDKS to communicate with APIs
        ├── mock
        └── index.ts
```

**Context**
it is not clear how to structure frontend applications in order to make it easy to 'reason' about the application's architecture and intent. The lack of alignment also means different teams diverge significantly in their structure making it more expensive to onboard members between teams, share knowledge and converge on existing patterns

**Options considered (Optional)**
* Feature driven module based structure
* Module based development
* Clean architecture
* Domain based structure

**Consequences**
* Our architectures will tell developers about the application/system, not about the frameworks we used in our application/system
* It should be intuitive where custom code is located compared to more generic (re-usable) code. Generic code becomes candidates for external packages like the component library
* We will get consistency between teams via a 'sensible default' lowering cognitive load and therefore overheads
* There will be technical debt created in the teams initially as a 'once off' to align with this structure
* It should be easier to 'reason' about the architecture, to understand its intent and therefore easier to manage its complexity resulting in streamlined development and reduced overheads
* Module based structures will make it easier to encapsulate a component and its concerns. E.g. deleting a module's folder should remove the component completely
* Module based structures will avoid the complexity of a 'star topology' or centralised shared components that would otherwise be uniquely associated with a single module like reducers and selectors

**Advice (Optional)**

**Consulted**
---