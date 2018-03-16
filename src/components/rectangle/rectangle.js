import Desktop from '../desktop/Desktop.vue'

export default {
  name: 'Rectangle',
  props: ['data'],
  parent: Desktop,
  
  data (x = 0, y = 0) {
    return {
      id: (() => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))(),
      positionX: x,
      positionY: y,
      width: 10,
      height: 10,
      backgroundColor: (() => '#' + Math.random().toString(16).slice(2, 8))(),
      active: false,
      deleted: false
    }
  },

  methods: {
    onRectangleClick () {
      this.$emit('activate', { id: this.data.id })
    }
  }
}
