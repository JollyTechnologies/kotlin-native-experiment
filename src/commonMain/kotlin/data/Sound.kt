package data

import FileRepo
import com.soywiz.korim.vector.format.SVG
import com.soywiz.korio.file.std.resourcesVfs

class Sound(val id: Int,
            val sassoonString: String,
            val regularString: String,
            val sortOrder: Int,
            val soundIdentifier: String,
            val soundGroupId: Int,
            val printPath: String,
            val precursivePath: String
) {
    lateinit var soundGroup: SoundGroup
    val wordSounds = mutableListOf<WordSound>()
}

object SoundRepo: FileRepo {
    lateinit var sounds: List<Sound>
    lateinit var soundsById: Map<Int, Sound>

    override suspend fun performLoading() {
        sounds = loadTsv("initial_data/sounds.tsv") {
            Sound(it[0].toInt(), it[1], it[2], it[3].toInt(), it[4], it[5].toInt(), it[6], it[7]).also { sound ->
                sound.soundGroup = SoundGroupRepo.soundGroupsMap[sound.soundGroupId]!!
            }
        }
        soundsById = sounds.associateBy { it.id }

        SoundGroupRepo.soundGroups.forEach { soundGroup ->
            soundGroup.sounds = sounds.filter { it.soundGroup == soundGroup }
        }
    }
}

object SoundSVGCache {
    private var map = mutableMapOf<Sound, SVG>()
    suspend fun svgForSound(sound: Sound) = map.getOrPut(sound, {
        SVG(resourcesVfs["sound_svgs/print_${sound.soundIdentifier}.svg"].readString())
    })
}

private fun String.postgresArrayToPaths() = this
        .removePrefix("{\"")
        .removeSuffix("\"}")
        .split("\",\"")

fun Sound.svgPath() = """
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <title></title>
    <g id="icomoon-ignore">
    </g>
    ${
    printPath.postgresArrayToPaths().joinToString(separator = "\n") { 
        "<path d=\"${printPath}\"></path>"
    }
}
    </svg>
""".trimIndent()
suspend fun Sound.svg() = SVG(svgPath())
