import com.soywiz.klock.DateTime
import com.soywiz.klogger.Console
import com.soywiz.klogger.log
import com.soywiz.korge.html.Html
import com.soywiz.korge.input.onClick
import com.soywiz.korge.scene.Scene
import com.soywiz.korge.ui.TextFormat
import com.soywiz.korge.ui.TextSkin
import com.soywiz.korge.ui.defaultUIFont
import com.soywiz.korge.ui.uiText
import com.soywiz.korge.view.*
import com.soywiz.korim.color.Colors
import com.soywiz.korim.color.RGBA
import com.soywiz.korim.vector.format.SVG
import com.soywiz.korim.vector.render
import com.soywiz.korim.vector.scaled
import com.soywiz.korio.file.std.resourcesVfs

class MenuScene() : Scene() {
    suspend override fun Container.sceneInit() {
        // set a background color
        val beforeLoad = DateTime.now()
        val afterLoad = DateTime.now()

        Console.log("Time to load sounds ${afterLoad.milliseconds - beforeLoad.milliseconds}")

        views.clearColor = Colors.BLACK
        defaultUIFont = Html.FontFace.Named("fonts/open_sans/OpenSans-Regular.ttf")

        val container = this
        val svg = SVG(resourcesVfs["backgrounds/bg_forest_mountains.svg"].readString())
        image(texture = svg.scaled(2).render(native = true)) {
            anchor(0.0, 0.0)
            scale(1.0)
            position(0, 0)
            width = container.width / container.scale
            height = container.height / container.scale
        }

        val textSkin = TextSkin(
                normal = TextFormat(RGBA(0, 0, 0), 24, defaultUIFont),
                over = TextFormat(RGBA(80, 80, 80), 24, defaultUIFont),
                down = TextFormat(RGBA(120, 120, 120), 24, defaultUIFont),
                disabled = TextFormat(RGBA(160, 160, 160), 24, defaultUIFont),
                backColor = Colors.WHITE
        )


        uiText(
                width = views.actualVirtualWidth * 0.3,
                height = 100.0,
                text = "Play Sound Tapping",
                skin = textSkin) {
            position((views.actualVirtualWidth - width) / 2, views.actualVirtualHeight / 2 - 64)
            onClick {
                sceneContainer.changeToAsync<SoundTapGame>()
            }
        }

        sceneContainer.changeToAsync<SoundTapGame>()
    }
}