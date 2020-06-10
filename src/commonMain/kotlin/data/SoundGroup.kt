package data

import FileRepo

class SoundGroup(val id: Int, val number: String){
    lateinit var sounds: List<Sound>
}

object SoundGroupRepo: FileRepo {
    lateinit var soundGroups: List<SoundGroup>
    lateinit var soundGroupsMap: Map<Int, SoundGroup>

    override suspend fun performLoading() {
        soundGroups = loadTsv("initial_data/sound_groups.tsv"){
            SoundGroup(it[0].toInt(), it[1])
        }
        soundGroupsMap = soundGroups.associateBy { it.id }
    }
}