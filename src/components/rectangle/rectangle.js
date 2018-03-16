import Desktop from '../desktop/Desktop.vue'

export default {
  name: 'Rectangle',
  props: ['rect'],
  parent: Desktop,
  
  data (x, y) {
    return {
      positionX: x || 0,
      positionY: y || 0,
      width: 10,
      height: 10,
      backgroundColor: '#fff',
      active: false,
      deleted: false
    }
  },

  methods: {
    onRectangleClick () {
      
    }
  }
}
