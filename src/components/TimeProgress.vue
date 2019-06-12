<template>
  <span class="time-progress">
    {{ progress }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ProgressType from '@/enums/ProgressType'

@Component
export default class TimeProgress extends Vue {
  @Prop({ type: Number, default: ProgressType.year })
  public type!: ProgressType
  public now: number = Date.now()

  public get firstDate(): number {
    const now = new Date()
    switch (this.type) {
      case ProgressType.day:
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()
      case ProgressType.month:
        return new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      case ProgressType.year:
      default:
        return new Date(now.getFullYear(), 0, 1).getTime()
    }
  }

  public get lastDate(): number {
    const now = new Date()
    switch (this.type) {
      case ProgressType.day:
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime()
      case ProgressType.month:
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime()
      case ProgressType.year:
      default:
        return new Date(now.getFullYear(), 11, 31).getTime()
    }
  }

  public get percent(): number {
    return Math.round((this.now - this.firstDate) / (this.lastDate - this.firstDate) * 100)
  }

  public get progress(): string {
    return '■'
      .repeat(Math.floor(this.percent / 8))
      .padEnd(12, '□')
  }
}
</script>
