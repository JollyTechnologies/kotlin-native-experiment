package data

import FileRepo

class Word(val id: Int, val text: String){
    var wordSounds: MutableList<WordSound> = mutableListOf()
}

object WordRepo: FileRepo {
    lateinit var words: List<Word>
    lateinit var wordsById: Map<Int, Word>

    override suspend fun performLoading() {
        words = loadTsv("initial_data/words.tsv"){
            Word(it[0].toInt(), it[1])
        }
        wordsById = words.associateBy { it.id }
    }
}