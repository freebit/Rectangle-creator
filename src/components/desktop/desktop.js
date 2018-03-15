
// import Vue from 'vue'
// import $ from 'jquery'
import axios from 'axios'

import Rectangle from '../rectangle/Rectangle.vue'

export default {
  name: 'Desktop',
  
  components: {
    rectangle: Rectangle
  },
  
  data () {
    return {
      msg: 'desktop',
      rectangleList: []
    }
  },

  methods: {
    createRectangle (evt) {
      this.rectangleList.push({
        positionX: `${evt.offsetX}px`,
        positionY: `${evt.offsetY}px`,
        width: '20px',
        height: '20px',
        backgroundColor: '#fff'
      })
    },

    cancelRectangle () {
      
    }
  },

  mounted () {
    axios.get('http://localhost:3000/rectangle/all')
      .then(res => {
        this.rectangleList = res.data
      })
      .catch(err => console.log(err))
  }

}
