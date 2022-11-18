export const projectArray = [
    {
        projectId: 1,
        projectTitle: "Project 1",
        projectCreationDate: "10/10/2010",
        todoTabs: {
            activeTodos: [
                {
                    id: 1,
                    todo: "Walk the dog",
                    isPriority: false,
                    isActive: true
                },
                {
                    id: 2,
                    todo: "Buy clothes",
                    isPriority: false,
                    isActive: true
                }
            ],
            completedTodos: [
                {
                    id: 3,
                    todo: "Eat breakfast",
                    isPriority: true,
                    isActive: true
                }
            ],
        }
    },
    {
        projectId: 2,
        projectTitle: "Project 2",
        projectCreationDate: "01/11/2015",
        todoTabs: {
            activeTodos: [],
            completedTodos: [],
        }
    }
];