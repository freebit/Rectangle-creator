import axios from 'axios'
import { omit } from 'lodash'
import Rectangle from '../rectangle/Rectangle.vue'

export default {
  name: 'Desktop',
  
  components: {
    rectangle: Rectangle
  },
  
  data () {
    return {
      drawnRectangle: null,
      activeRectangles: [],
      rectangleList: []
    }
  },

  methods: {
    createRectangle (evt) {
      // первый клик
      if (!this.drawnRectangle) {
        const {offsetX, offsetY} = evt
        this.drawnRectangle = Rectangle.data(offsetX, offsetY)
        this.rectangleList.push(this.drawnRectangle)
      // второй клик
      } else { 
        this.drawnRectangle = null  
      }
    },

    drawRectangle (evt) {
      if (!this.drawnRectangle) return
      
      const indent = 1 // отступ от указателя мыши
      const deltaX = evt.offsetX - parseInt(this.drawnRectangle.positionX)
      const deltaY = evt.offsetY - parseInt(this.drawnRectangle.positionY)

      this.drawnRectangle.width = deltaX - indent
      this.drawnRectangle.height = deltaY - indent
    },

    adjustData (data) {
      return data.map((rect) => {
        // расширяем объекты недостающими свойствами
        return Object.assign({}, rect, omit(Rectangle.data(), Object.keys(rect)))
      })
    },

    cancelDrawRectangle () {
      if (!this.drawnRectangle) return
      this.rectangleList.pop()
      this.drawnRectangle = null
    },

    deleteRectangles () {
      console.log('delete')
    },

    initKeyEventHandler () {
      document.onkeydown = (evt) => {
        evt = evt || window.event
        if (evt.keyCode === 27) {
          this.cancelDrawRectangle()
        } else if (evt.keyCode === 46) {
          this.deleteRectangles()
        }
      }
    }
  },

  mounted () {
    axios.get('http://localhost:3000/rectangle/all')
      .then(res => {
        this.rectangleList = this.adjustData(res.data)
        console.log(this.rectangleList)
      })
      .catch(err => console.log(err))

    this.initKeyEventHandler()
  }

}
