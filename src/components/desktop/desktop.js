import axios from 'axios'
import { omit } from 'lodash'

import Header from '../header/Header.vue'
import Rectangle from '../rectangle/Rectangle.vue'

import Config from '../../../config/index'

const API_URL = Config[(process.env.NODE_ENV === 'development' ? 'dev' : 'build')].apiUrl

export default {
  name: 'Desktop',
  
  components: {
    'desktop-header': Header,
    'rectangle-item': Rectangle
  },
  
  data () {
    return {
      rectangleList: [],

      drawData: {
        drawnRectangle: null,
        startX: null,
        startY: null
      },
      dragData: {
        draggedRectangle: null,
        shiftX: 0,
        shiftY: 0,
        wasShifted: false
      }
    }
  },

  methods: {
    
    createRectangle (evt) {
      // первый клик
      if (!this.drawData.drawnRectangle) {
        const {offsetX, offsetY} = evt
        this.drawData.drawnRectangle = Rectangle.data(offsetX, offsetY)
        this.dragData.startX = offsetX
        this.dragData.startY = offsetY
        this.rectangleList.push(this.drawData.drawnRectangle)
      // второй клик
      } else { 
        if (Number(this.drawData.drawnRectangle.width) > 0 && Number(this.drawData.drawnRectangle.height) > 0) {
          if (!this.drawData.drawnRectangle._id) {
            this.saveRectangle()
          } else {
            this.updateRectangle(this.drawData.drawnRectangle)
          }
        } else {
          this.rectangleList.pop()
        }

        this.drawData.drawnRectangle = null
        this.dragData.startX = null
        this.dragData.startY = null
      }
    },

    initDraw (payload) {
      console.log('init draw with - ', payload)

      this.drawData.drawnRectangle = this.rectangleList.find(rect => rect.id === payload.id)
    },

    drawRectangle (evt) {
      if (!this.drawData.drawnRectangle) return
      
      const indent = 12 // отступ от указателя мыши, что бы исключить клик по прямоугольнику при завершении draw
      const deltaX = evt.offsetX - this.dragData.startX
      const deltaY = evt.offsetY - this.dragData.startY

      if (deltaX < 0 && deltaY > 0) {
        this.drawData.drawnRectangle.positionX = evt.offsetX + indent
        this.drawData.drawnRectangle.width = Math.abs(deltaX)
        this.drawData.drawnRectangle.height = deltaY - indent
      } else if (deltaX < 0 && deltaY < 0) {
        this.drawData.drawnRectangle.positionX = evt.offsetX + indent
        this.drawData.drawnRectangle.width = Math.abs(deltaX)

        this.drawData.drawnRectangle.positionY = evt.offsetY + indent
        this.drawData.drawnRectangle.height = Math.abs(deltaY)
      } else if (deltaX > 0 && deltaY < 0) {
        this.drawData.drawnRectangle.positionY = evt.offsetY + indent
        this.drawData.drawnRectangle.height = Math.abs(deltaY)
        this.drawData.drawnRectangle.width = deltaX - indent
      } else {
        this.drawData.drawnRectangle.width = deltaX - indent
        this.drawData.drawnRectangle.height = deltaY - indent
      }
    },

    adjustData (data) {
      return data.map((rect) => {
        // расширяем объекты недостающими клиентскими свойствами
        return Object.assign({}, rect, omit(Rectangle.data(), Object.keys(rect)))
      })
    },

    cancelDrawRectangle () {
      if (!this.drawData.drawnRectangle) return
      this.rectangleList.pop()
      this.drawData.drawnRectangle = null
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
      axios.get(API_URL + '/rectangle/all')
        .then(res => {
          if (res.data && res.data.length) {
            this.rectangleList = this.adjustData(res.data)
          }
        })
        .catch(err => console.log(err))
    },

    saveRectangle () {
      const lastRectangle = this.rectangleList.slice(-1)[0]
      
      axios.post(API_URL + '/rectangle', lastRectangle)
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
      
      if (!deletedRectangles.length) return

      axios.delete(API_URL + `/rectangle/${deletedRectangles.join(',')}`)
        .then((res) => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    clearAll () {
      let deletedRectangles = this.rectangleList.reduce((result, current) => {
        result += `${current.id},`
        return result
      }, '')

      axios.delete(API_URL + `/rectangle/${deletedRectangles}`)
        .then((res) => {
          this.rectangleList = []
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    updateRectangle (rectangle) {
      axios.put(API_URL + '/rectangle', rectangle)
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
        if (this.dragData.wasShifted) {
          this.updateRectangle(this.dragData.draggedRectangle)
          this.dragData.wasShifted = false
        } 
        return false
      } else {
        this.dragData.draggedRectangle.positionX = String(data.clientX - this.dragData.shiftX)
        this.dragData.draggedRectangle.positionY = String(data.clientY - this.dragData.shiftY)
        this.dragData.wasShifted = (data.offsetX !== 0 || data.offsetY !== 0)
      }
    }
  },

  mounted () {
    this.fetchAllRectangles()
    this.initKeyEventHandler()
  }

}
