import Desktop from '../desktop/Desktop.vue'

export default {
  name: 'desktop-header',
  props: ['data'],
  parent: Desktop,
  
  data () {
    return {
      title: 'Rectangles creator',
      version: 'v0.0.1'
    }
  },

  methods: {
    clearAll () {
      this.$emit('clear-all')
    },

    onCloserClick () {
      this.$emit('close', { id: this.data.id })
    }
  }
}
