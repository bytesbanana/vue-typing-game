<script setup>
import Hero from "./components/Hero.vue";
import { ref, computed } from "vue";
import { nextTick } from "process";

const challengeWords = ref("The quick brown fox jumps over the lazy dog.");
const currentInput = ref("");
const currentFocusIndex = ref(0);
const currentInputRef = ref(null);

const challengeWordsInArr = computed({
  get() {
    return challengeWords.value.split(" ");
  },
});

const inputDisable = computed({
  get() {
    return challengeWordsInArr.value.length - 1 === currentFocusIndex.value;
  },
});

const handleKeydown = (e) => {
  if (
    (e.code === "Space" || e.code === "Enter") &&
    currentInput.value.length >= 0
  ) {
    e.preventDefault();
    currentInput.value = "";
    currentFocusIndex.value += 1;
    return;
  }
};

const handleInput = (e) => {
  currentInput.value = e.target.value;
};

const handleRestartClick = () => {
  currentFocusIndex.value = 0;
  currentInput.value = "";
  setTimeout(() => {
    currentInputRef.value.focus();
  });
};
</script>

<template>
  <main class="h-screen w-screen justify-center bg-slate-900">
    <Hero />
    <section class="min-h- px-8 pt-8">
      <div
        class="flex flex-row justify-evenly rounded-t-lg border border-b-0 px-8 py-4 text-2xl text-white"
      >
        <span
          v-for="(w, i) in challengeWordsInArr"
          class="rounded-md px-1"
          :class="{
            border: currentFocusIndex === i,
          }"
        >
          {{ w }}
        </span>
      </div>
    </section>

    <section class="px-8">
      <input
        ref="currentInputRef"
        type="text"
        class="h-[36px] w-full rounded-b-lg p-4 text-xl font-semibold caret-red-500"
        auto-complete="off"
        @keydown="handleKeydown"
        @input="handleInput"
        v-model="currentInput"
        :disabled="inputDisable"
      />
    </section>

    <section class="p-8">
      <button
        v-if="inputDisable"
        class="rounded-md border px-4 py-2 font-semibold text-slate-100 transition-all duration-300 ease-out hover:bg-slate-200 hover:text-gray-800 active:scale-110"
        @click="handleRestartClick"
      >
        Restart
      </button>
    </section>
  </main>
</template>
