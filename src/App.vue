<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/solid'

const MAX_TIME_IN_SEC = 60

const interval = ref(null)
const currentInput = ref("")
const currentTime = ref(60)
const isStart = ref(false)
const currentFocusIndex = ref(0);
const word = ref("")
const result = ref([])
const pressCtrlOrCmd = ref(null)

const wordSplit = computed({
  set(value) {
    word.value = value.split(" ");
  },
  get() {
    return word.value.split(" ")
  }
});

const focusEl = ref(null)
const challengeEl = ref(null)
const inputEl = ref(null)




onMounted(async () => {
  const res = await fetch('/word.txt')
  if (res.ok) {
    const data = await res.text()
    word.value = data
  }

  inputEl.value.focus()
});


const assignFocusElement = (el, i) => {
  if (currentFocusIndex.value === i) {
    focusEl.value = el
  }
}


const wpm = computed({
  get() {
    return result.value.filter(r => r === true).length
  }
})

watch(isStart, (started, _) => {
  if (started) {
    interval.value = setInterval(() => {

      currentTime.value -= 1
      if (currentTime.value === 0) {
        currentInput.value = ""
        isStart.value = false
        clearInterval(interval.value)
      }
    }, 1000)
  }
});




const handleRestartClick = () => {
  currentFocusIndex.value = 0
  currentTime.value = MAX_TIME_IN_SEC
  result.value = []

  setTimeout(() => {
    challengeEl.value.scrollTop = 0
    inputEl.value.focus()
  })

}

const handleOnKeydown = (e) => {

  if (!isStart.value) isStart.value = true
  if (currentFocusIndex.value !== wordSplit.value.length) {

    if (e.key === " ") {
      e.preventDefault();
      result.value.push(currentInput.value === wordSplit.value[currentFocusIndex.value])
      currentInput.value = ""
      currentFocusIndex.value += 1

      challengeEl.value.scrollTop = focusEl.value.offsetTop - challengeEl.value.offsetTop - 16

    } else if (e.key.length === 1) {
      currentInput.value += e.key

    } else if (e.key === "Backspace") {
      if (e.metaKey || e.ctrlKey) {
        currentInput.value = ""
      } else {
        currentInput.value = currentInput.value.substring(0, currentInput.value.length - 1)
      }
    }
  }


};

const handleOnKeyPress = (e) => {
  console.log("key press", e.ctrlKey)
}

const handleOnKeyUp = () => {
  console.log("key up")
}



</script>

<template>

  <div class="layout">
    <h1>Typing Speed Test</h1>
    <div class="challenge" ref="challengeEl">

      <span class="word" v-for="(w, i) in wordSplit" :class="{
        focus: currentFocusIndex === i,
        failed: result[i] === false,
        pass: result[i] === true
      }" :ref="(el) => assignFocusElement(el, i)">
        {{ w }}
      </span>
    </div>

    <input ref="inputEl" type="text" class="input" @keydown="handleOnKeydown" :value="currentInput"
      :disabled="currentTime <= 0" @keypress="handleOnKeyPress" @keyup="handleOnKeyUp">



    <div class="timer">
      {{ pressCtrlOrCmd }}
      <h3 v-if="currentTime > 0">{{ currentTime }}s</h3>

      <h3 v-if="currentTime <= 0">Timeout</h3>
      <button v-if="currentTime <= 0" class="restart" @click.prevent="handleRestartClick">
        <ArrowPathIcon /> Restart
      </button>
    </div>

    <div class="result" v-if="currentTime <= 0">
      <h1>Result</h1>
      <div class="result-detail">
        <h2>WPM:</h2>
        <p>{{ wpm }}</p>
      </div>

    </div>
  </div>


</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 3rem;
  background-color: rgb(10, 5, 24);
}

.layout>h1 {
  color: white;
  text-align: center;
  font-size: 3rem;
  margin: 0;
  padding: 1.5rem;

}

.challenge {
  border: 1px solid grey;
  background-color: rgb(252, 252, 252);
  display: flex;
  overflow: hidden;
  padding: 1rem 1rem 3rem;
  gap: 4px;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
  max-height: 10rem;
  justify-content: space-evenly;
  scroll-behavior: smooth;
}

.word {
  font-size: 2rem;
  padding: 4px;
  line-height: 2rem;
  color: rgb(26, 26, 26);
  border-radius: 8px;
}

.focus {
  background-color: rgb(89, 89, 89);
  color: white;
}

.failed {
  color: rgb(216, 31, 31);
}

.pass {
  color: rgb(0, 192, 48);
}

.input {
  width: 100%;
  background-color: white;
  height: 4rem;
  padding: 0;
  border-radius: 0 0 8px 8px;
  border: none;
  font-size: 2rem;
}

.input:disabled {
  background-color: rgb(222, 222, 222);
}

.timer {
  display: flex;
  gap: 2rem;
  color: white;
  justify-content: center;
  align-items: center;
}

.timer h3 {
  font-size: 3rem;
  padding: 1rem;
}

button.restart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 8px;
  padding: 0.25rem;
  box-shadow: none;
  text-shadow: none;
  color: white;
  width: 50px;
  height: 50px;
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 1s;
}

button.restart:hover {
  background-color: salmon;
  scale: 1.02;
}

button.restart:hover svg {


  animation-name: anim-rotate;
  animation-duration: 2s;
}

@keyframes anim-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
}

.result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 2px solid salmon;
  border-radius: 8px;
  padding: 1rem;
  max-width: min(50vw, 350px);
}

.result * {
  color: white
}

.result>h1 {
  font-size: 2rem;
  font-weight: bold;
}

.result * {
  color: white;
  font-size: 2rem;
  padding: 0;
  margin: 0;
  text-align: center;
}

.result h1 {
  font-size: 3rem;
  text-align: center;
}

.result p {
  text-align: left;
}

.result .result-detail {
  display: grid;
  min-width: 350px;
  grid-template-columns: auto auto;
}
</style>
