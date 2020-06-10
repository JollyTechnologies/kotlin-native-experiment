import com.soywiz.klock.TimeSpan
import com.soywiz.klogger.Console
import com.soywiz.klogger.log
import com.soywiz.kmem.divCeil
import com.soywiz.korge.box2d.*
import com.soywiz.korge.html.Html
import com.soywiz.korge.input.onMouseDrag
import com.soywiz.korge.input.onOut
import com.soywiz.korge.input.onOver
import com.soywiz.korge.scene.Scene
import com.soywiz.korge.tween.moveBy
import com.soywiz.korge.ui.TextFormat
import com.soywiz.korge.ui.TextSkin
import com.soywiz.korge.view.*
import com.soywiz.korim.color.Colors
import com.soywiz.korim.color.RGBA
import com.soywiz.korim.format.readBitmap
import com.soywiz.korim.vector.Context2d
import com.soywiz.korim.vector.paint.ColorPaint
import com.soywiz.korio.file.std.resourcesVfs
import com.soywiz.korma.geom.Matrix
import com.soywiz.korma.geom.Rectangle
import com.soywiz.korma.geom.Size
import com.soywiz.korma.geom.vector.VectorPath
import com.soywiz.korma.geom.vector.circle
import com.soywiz.korma.geom.vector.rect
import data.Sound
import data.SoundRepo
import kotlinx.coroutines.delay
import org.jbox2d.callbacks.QueryCallback
import org.jbox2d.collision.AABB
import org.jbox2d.collision.shapes.CircleShape
import org.jbox2d.collision.shapes.EdgeShape
import org.jbox2d.common.Vec2
import org.jbox2d.dynamics.*
import org.jbox2d.dynamics.joints.MouseJoint
import org.jbox2d.dynamics.joints.MouseJointDef
import kotlin.random.Random

object PhysicsConstants {
    val worldScale = 20.0
}

val Number.fromMetersToPixels get() = (this.toDouble() * PhysicsConstants.worldScale)

class SoundTapGame : Scene() {

    var random = Random(13241234124123)
    var sound = SoundRepo.sounds.drop(6).random()
    val possibleSounds = SoundRepo.sounds.takeWhile { it != sound }
    var numberOfSounds = 5
    lateinit var worldView: WorldView

    val soundComponentSize by lazy { meterSize.width / 10 }
    var soundComponents: List<SoundComponent> = emptyList()
    lateinit var ground: Body

    override suspend fun Container.sceneInit() {
        views.clearColor = Colors.DARKGREEN
//        solidRect(300.0, 200.0, Colors.DARKCYAN)

        worldView = worldView(World(gravity = Vec2())) {
            position(0, views.actualVirtualHeight).scale(PhysicsConstants.worldScale)
            createWalls()
            soundComponents = spawnSounds()
        }


//        addUpdater {
//            Console.log("dt $it")
//            soundComponents.forEach {
//                Console.log("${it.sound.soundIdentifier}, ${it.body.position}")
//            }
//        }


    }


    fun WorldView.createWalls() {
        ground = world.createBody(BodyDef().apply {
            position = Vec2()
            fixedRotation = true
        })
        val makeWall = { from: Vec2, to: Vec2 ->
            ground.createFixture(EdgeShape().apply {
                set(from, to)
            }, 1f)
        }
        val bottomLeft = Vec2(0f, 0f)
        val topRight = Vec2(meterSize.width.toFloat(), meterSize.height.toFloat())
        val bottomRight = Vec2(topRight.x, 0f)
        val topLeft = Vec2(0f, topRight.y)

        makeWall(topLeft, topRight)
        makeWall(topRight, bottomRight)
        makeWall(bottomRight, bottomLeft)
        makeWall(bottomLeft, topLeft)
    }

    private fun findBodyIntersecting(vec: Vec2, func: (Body) -> Boolean) {
        worldView.world.queryAABB(object : QueryCallback {
            override fun reportFixture(fixture: Fixture): Boolean {
                Console.log("fixture data ${fixture.userData}")

                return fixture.getBody()?.let {
                    Console.log("Got body $it , ${it.userData}")
                    func(it)
                } ?: false
            }
        }, AABB(vec, vec))
    }


    val meterSize by lazy {
        Size(width = views.actualVirtualWidth / PhysicsConstants.worldScale,
                height = views.actualVirtualHeight / PhysicsConstants.worldScale)
    }

    suspend fun WorldView.spawnSounds(): List<SoundComponent> {
        val numCorrect = numberOfSounds.divCeil(3);
        val correct = (0..numCorrect).map { SoundComponent(sound, soundComponentSize.toFloat()) }
        val other = (numCorrect..numberOfSounds).map { SoundComponent(possibleSounds.random(), soundComponentSize.toFloat()) }


        val componentsToAdd = (correct + other).shuffled()
        componentsToAdd.forEach {
            it.loadImage()
            delay(1)
            addSoundComponent(it);
        }
        return componentsToAdd
    }

    suspend fun WorldView.addSoundComponent(soundComponent: SoundComponent) {
        soundComponent.apply {
            val pos = randomPosition()
            createBody(randomPosition(), ground)
        }
    }

    private fun randomPosition(): Vec2 {
        val rand = { random.nextDouble() }
        return Vec2(
                (meterSize.width * rand()).toFloat(),
                (meterSize.height * rand()).toFloat()
        )
    }
}


class SoundComponent(val sound: Sound, var mSize: Float): Graphics() {
    lateinit var body: Body
    var mouseJoint: MouseJoint? = null

    fun WorldView.createBody(pos: Vec2, ground: Body) {
        body = createBody {
            setPosition(pos.x, pos.y)
            linearDamping = 0.3f
            fixedRotation = true
            type = BodyType.DYNAMIC
            userData = this@SoundComponent
        }.fixture {
            shape = CircleShape(mSize / 2)
            density = 0.01f
            restitution = 0.15f
            userData = this@SoundComponent
        }.setView(this@SoundComponent)
        this@SoundComponent.makeDraggable(this, ground)
        Console.log("User data ${this@SoundComponent} ${body.userData} ${body}")
    }

    override fun hitTest(x: Double, y: Double): View? {
        val adjustedSize = mSize * PhysicsConstants.worldScale
         return super.hitTest(x - adjustedSize, y - adjustedSize)
    }

    init {
        x = mSize * -0.5
        y = mSize * -0.5

        fillStroke(ColorPaint(Colors.WHITE).apply {
        }, ColorPaint(RGBA.float(61f, 61f, 61f, 0.24f)), Context2d.StrokeInfo(thickness = 10.0)) {
            roundRect(mSize.toDouble(), mSize.toDouble(), 2.0)
        }
    }

    suspend fun loadImage() {
        val soundImage = resourcesVfs["sound_images/print_${sound.soundIdentifier}.png"].readBitmap()
        val imageWidth = soundImage.width.toDouble()
        val imageHeight = soundImage.height.toDouble()

        val ratio = (imageWidth / imageHeight)
        Console.log("w $imageWidth h $imageHeight, ratio: ${ratio}")

        val rect = if (imageHeight > imageWidth) {
            val actualWidth = mSize * ratio
            Rectangle(
                    y = 0.0,
                    height = mSize.toDouble(),
                    x = (mSize - actualWidth) / 2.0,
                    width = actualWidth
            )
        } else {
            val actualHeight = mSize * (1 / ratio)
            Rectangle(
                    x = 0.0,
                    width = mSize.toDouble(),
                    y = (mSize - actualHeight) / 2.0,
                    height = actualHeight
            )
        }
        //            rect.displace(-rect.width/2, -rect.height/2)
        rect.inflate(rect.width * -0.15, rect.height * -0.15)
        Console.log("rect $rect")

        image(soundImage) {
            rect.let { rect ->
                position(rect.x, rect.y)
            }
            width = rect.width
            height = rect.height
        }
    }

    private fun View.makeDraggable(worldView: WorldView, ground: Body) {
        onMouseDrag { drag ->
            val scale = (PhysicsConstants.worldScale * views.stage.scale)
            val mouseVec = Vec2((drag.dx / scale).toFloat(), -(drag.dy / scale).toFloat())

            if (drag.start) {
                mouseJoint = worldView.world.createJoint(MouseJointDef().apply {
                    bodyA = ground
                    bodyB = body
                    collideConnected = true
                    maxForce = 10000f
                    frequencyHz = 5.0f
                    dampingRatio = 0.1f
                }) as MouseJoint
            } else if (drag.end) {
                mouseJoint?.let {
                    worldView.world.destroyJoint(mouseJoint)
                }
            } else {
                mouseJoint?.apply {
                    Console.log("OldTarget $target")
                    target = mouseVec
                    Console.log("NewTarget $target")
                }
            }
        }
    }
}




fun <T : View> T.interactive(): T = this.apply {
    alpha = 0.5
    onOver { alpha = 1.0 }
    onOut { alpha = 0.5 }
}

//fun WorldView.example(views: Views) {
//    val redWidth = views.actualVirtualWidth / 20.0
//    createBody {
//        setPosition(0, 0)
//    }.fixture {
//        shape = BoxShape(redWidth, 20)
//        density = 0f
//    }.setView(solidRect(redWidth, 20.0, Colors.RED).position(redWidth * -0.5, -10).interactive())
//
//    // Dynamic Body
//    createBody {
//        type = BodyType.DYNAMIC
//        setPosition(0, 7)
//    }.fixture {
//        shape = BoxShape(2f, 2f)
//        density = 0.5f
//        friction = 0.2f
//    }.setView(solidRect(2.0, 2.0, Colors.GREEN).anchor(.5, .5).interactive())
//
//    createBody {
//        type = BodyType.DYNAMIC
//        setPosition(0.75, 13)
//    }.fixture {
//        shape = BoxShape(2f, 2f)
//        density = 1f
//        friction = 0.2f
//    }.setView(sgraphics {
//        fill(Colors.BLUE) {
//            rect(-1f, -1f, 2f, 2f)
//        }
//    }.interactive())
//
//    createBody {
//        type = BodyType.DYNAMIC
//        setPosition(0.5, 15)
//    }.fixture {
//        shape = CircleShape().apply { m_radius = 2f }
//        density = 22f
//        friction = 3f
//    }.setView(sgraphics {
//        fillStroke(ColorPaint(Colors.BLUE), ColorPaint(Colors.RED), Context2d.StrokeInfo(thickness = 0.3)) {
//            circle(0, 0, 2)
//            //rect(0, 0, 400, 20)
//        }
//        fill(Colors.DARKCYAN) {
//            circle(1, 1, 0.2)
//        }
//        hitTestUsingShapes = true
//    }.interactive())
//}