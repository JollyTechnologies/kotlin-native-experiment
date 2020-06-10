import com.soywiz.korio.file.std.resourcesVfs

interface FileRepo {

    suspend fun performLoading()

    suspend fun <T> loadTsv(filePath: String, rowMap: (List<String>) -> T) = resourcesVfs[filePath].readString().split("\n")
            .drop(1)
            .map {
                it.split("\t").let(rowMap)
            }
}