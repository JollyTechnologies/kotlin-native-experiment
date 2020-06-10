import com.soywiz.korge.Korge
import com.soywiz.korge.scene.Module
import com.soywiz.korge.scene.Scene
import com.soywiz.korinject.AsyncInjector
import data.*
import kotlin.reflect.KClass

suspend fun main() = Korge(Korge.Config(module = MyModule))

object MyModule : Module() {
    // define the opening scene
    override val mainScene: KClass<out Scene> = MenuScene::class

    // define the game configs
    override val title: String = "My Test Game"

    // add the scenes to the module
    override suspend fun init(injector: AsyncInjector): Unit = injector.run {
        setupData()
        mapPrototype { MenuScene() }
        mapPrototype { SoundTapGame() }
    }
    
    suspend fun setupData(){
        SoundGroupRepo.performLoading()
        SoundRepo.performLoading()
        WordRepo.performLoading()
        WordSoundRepo.performLoading()
    }
}



