import { defineStore } from 'pinia'

export const useToolsStore = defineStore('tools', {
    state: () => ({
        tools: []
    }),
    actions: {
        addTool(tool) {
            this.tools.push(tool)
        },
    },
})
