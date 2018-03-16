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
        this.saveRectangle()
      }
    },

    drawRectangle (evt) {
      if (!this.drawnRectangle) return
      
      const indent = 9 // отступ от указателя мыши, что бы исключить клик по прямоугольнику
      const deltaX = evt.offsetX - parseInt(this.drawnRectangle.positionX)
      const deltaY = evt.offsetY - parseInt(this.drawnRectangle.positionY)

      this.drawnRectangle.width = deltaX - indent
      this.drawnRectangle.height = deltaY - indent
    },

    adjustData (data) {
      return data.map((rect) => {
        // расширяем объекты недостающими клиентскими свойствами
        return Object.assign({}, rect, omit(Rectangle.data(), Object.keys(rect)))
      })
    },

    cancelDrawRectangle () {
      if (!this.drawnRectangle) return
      this.rectangleList.pop()
      this.drawnRectangle = null
    },

    activateRectangle (payload) {
      let rectIndex = 0
      let rect = this.rectangleList.find((rect, index) => {
        if (rect.id === payload.id) {
          rectIndex = index
          return true
        }
      })
      rect.active = !rect.active // toggle
      // если активирован, то вытаскиваем его наверх
      if (rect.active) {
        this.rectangleList.splice(rectIndex, 1)
        this.rectangleList.push(rect) 
      }
    },

    initKeyEventHandler () {
      document.onkeydown = (evt) => {
        const event = evt || window.event
        
        if (event.keyCode === 27) { // escape
          this.cancelDrawRectangle()
        } else if (event.keyCode === 46) { // delete
          this.deleteRectangles()
        }
      }
    },

    fetchAllRectangles () {
      axios.get('http://localhost:3000/rectangle/all')
        .then(res => {
          this.rectangleList = this.adjustData(res.data)
        })
        .catch(err => console.log(err))
    },

    saveRectangle () {
      const lastRectangle = this.rectangleList.slice(-1)[0]
      
      axios.post('http://localhost:3000/rectangle', lastRectangle)
        .then((res) => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    deleteRectangles () {
      const deletedRectangles = []
      this.rectangleList = this.rectangleList.filter(rect => {
        if (rect.active) {
          deletedRectangles.push(rect.id)
          return false
        } else {
          return true
        }
      })
      
      axios.delete(`http://localhost:3000/rectangle/${deletedRectangles.join(',')}`)
        .then((res) => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  mounted () {
    this.fetchAllRectangles()
    this.initKeyEventHandler()
  }

}
