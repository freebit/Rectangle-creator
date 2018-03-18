import Desktop from '../desktop/Desktop.vue'

export default {
  name: 'desktop-header',
  props: ['data'],
  parent: Desktop,
  
  data () {
    return {
      title: 'Rect',
      version: 'v0.0.1',

      state: {
        open: false
      }
    }
  },

  methods: {
    clearAll () {
      this.$emit('clear-all')
    },

    onInfoClick () {
      
    }
  }
}
