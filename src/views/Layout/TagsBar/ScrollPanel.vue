<template>
  <div class="scroll-container" ref="scrollContainer" @mousewheel="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot/>
    </div>
  </div>
</template>

<script>
  const padding = 15; // tag's padding

  export default {
    name: 'ScrollPane',
    data() {
      return {
        left: 0
      };
    },
    methods: {
      handleScroll(e) {
        e.preventDefault();
        const $container = this.$refs.scrollContainer;
        const $containerWidth = $container.offsetWidth;
        const $wrapper = this.$refs.scrollWrapper;
        const $wrapperWidth = $wrapper.offsetWidth;

        if (e.wheelDelta > 0) {
          this.left = Math.min(0, this.left + e.wheelDelta);
        } else {
          // console.log('scrollPane', $container.clientLeft, $containerWidth, padding, $wrapperWidth, $containerWidth - padding < $wrapperWidth);
          if ($containerWidth - padding < $wrapperWidth) {
            if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            } else {
              this.left = Math.max(this.left + e.wheelDelta, $containerWidth - $wrapperWidth - padding);
            }
          } else {
            this.left = 0;
          }
        }
      },
      moveToTarget($target) {
        const $container = this.$refs.scrollContainer;
        const $containerWidth = $container.offsetWidth;
        const $targetLeft = $target.offsetLeft;
        const $targetWidth = $target.offsetWidth;
        if ($targetLeft < -this.left) {
          this.left = -$targetLeft + padding;
        } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        } else {
          this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding);
        }
      }
    }
  };
</script>

<style scoped>
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .scroll-container .scroll-wrapper {
    position: absolute;
  }
</style>
