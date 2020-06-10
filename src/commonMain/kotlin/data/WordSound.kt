package data

import FileRepo

class WordSound(val id: Int,
                val soundId: Int,
                val sort_order: Int,
                val display_string: String,
                val linked_word_sound_id: String,
                val wordId: Int) {
    lateinit var word: Word
    lateinit var sound: Sound
}


object WordSoundRepo: FileRepo {
    override suspend fun performLoading() {
        loadTsv("initial_data/word_sound.tsv"){
            WordSound(it[0].toInt(), it[1].toInt(), it[2].toInt(), it[3], it[4], it[5].toInt()).also { wordSound ->
                wordSound.apply {
                    sound = SoundRepo.soundsById[soundId]!!
                    sound.wordSounds.add(this)

                    word = WordRepo.wordsById[wordId]!!
                    word.wordSounds.add(this)
                }
            }
        }
    }
}