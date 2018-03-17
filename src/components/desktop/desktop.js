import axios from 'axios'
import { omit } from 'lodash'

import Header from '../header/Header.vue'
import Rectangle from '../rectangle/Rectangle.vue'

export default {
  name: 'Desktop',
  
  components: {
    'desktop-header': Header,
    'rectangle-item': Rectangle
  },
  
  data () {
    return {
      rectangleList: [],
      drawnRectangle: null,
      dragData: {
        draggedRectangle: null,
        shiftX: 0,
        shiftY: 0
      }
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
        if (Number(this.drawnRectangle.width) > 0 && Number(this.drawnRectangle.height) > 0) {
          this.saveRectangle()
        } else {
          this.rectangleList.pop()
        }

        this.drawnRectangle = null
      }
    },

    drawRectangle (evt) {
      if (!this.drawnRectangle) return
      
      const indent = 9 // отступ от указателя мыши, что бы исключить клик по прямоугольнику при завершении draw
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
      // if (rect.active) {
      //   this.rectangleList.splice(rectIndex, 1)
      //   this.rectangleList.push(rect) 
      // }
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

    deleteRectangles (payload) {
      let deletedRectangles = []

      // фильтруем и собираем id удалямых
      if (payload && payload.id) {
        deletedRectangles.push(payload.id)
        this.rectangleList = this.rectangleList.filter(rect => rect.id !== payload.id)
      } else {
        this.rectangleList = this.rectangleList.filter(rect => {
          if (rect.active) {
            deletedRectangles.push(rect.id)
            return false
          } else {
            return true
          }
        })
      }
 
      axios.delete(`http://localhost:3000/rectangle/${deletedRectangles.join(',')}`)
        .then((res) => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    clearAll () {
      this.rectangleList = []
    },

    updateRectangle (rectangle) {
      axios.put('http://localhost:3000/rectangle', rectangle)
        .then((res) => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    onDragged (data) {
      if (data.first) {
        const elementId = data.el.getAttribute('id')
        this.dragData.draggedRectangle = this.rectangleList.find(rect => rect.id === elementId)

        this.dragData.shiftX = data.clientX - Number(this.dragData.draggedRectangle.positionX)
        this.dragData.shiftY = data.clientY - Number(this.dragData.draggedRectangle.positionY)
        return false
      } else if (data.last) {
        this.updateRectangle(this.dragData.draggedRectangle)
        return false
      } else {
        this.dragData.draggedRectangle.positionX = String(data.clientX - this.dragData.shiftX)
        this.dragData.draggedRectangle.positionY = String(data.clientY - this.dragData.shiftY)
      }
    }
  },

  mounted () {
    this.fetchAllRectangles()
    this.initKeyEventHandler()
  }

}
