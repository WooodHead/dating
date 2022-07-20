<template>
    <div>
        <card class="flex flex-col items-center justify-center">
            <div class="px-3 py-3">
                <h1 class="text-center text-3xl text-80 font-light">Forbidden words</h1>
            </div>
        </card>
        <card class="flex flex-col items-center justify-center">
            <div class="flex flex-row items-start justify-center">
                <input type="text" class="w-full form-control form-input form-input-bordered" v-model="newWord">
                <button
                    class="btn btn-link dim cursor-pointer text-80 ml-auto mr-6"
                    type="button"
                    @click="addWord"
                >Add a word</button>
            </div>
        </card>
        <card class="flex flex-col items-center justify-center">
            <div class="flex flex-row items-center justify-center">
                <div class="m-3" v-for="(word, index) in words" key="word._id">
                    <input
                        type="checkbox"
                        id="word._id"
                        :checked="word.isActive"
                        @change="toggleIsActive(index)"
                        v-model="words[index].isActive"
                    >
                    <label for="word._id">{{ word.word }}</label>
                </div>
            </div>
        </card>

    </div>
</template>

<script>
export default {
    props: [
        'card',

        // The following props are only available on resource detail cards...
        // 'resource',
        // 'resourceId',
        // 'resourceName',
    ],
    data() {
        return {
            words: this.card.words || [],
            newWord: '',
        }
    },

    mounted() {
        //
    },
    methods: {
        toggleIsActive(index) {
            const word = this.words[index];
            if (!word) {
                return;
            }
            axios.post(`/nova-vendor/ForbiddenWordsCard/is-active/${word._id}`, {
                isActive: word.isActive
            }).catch(err => {
                console.log(err)
                Nova.$emit('error', err);
            });
        },
        addWord() {
            axios.post(`/nova-vendor/ForbiddenWordsCard/add/`, {
                word: this.newWord,
            }).catch(err => {
                console.log(err)
                Nova.$emit('error', err);
            });
        },
    }
}
</script>
