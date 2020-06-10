import com.soywiz.korge.gradle.*
import com.squareup.sqldelight.gradle.SqlDelightPlugin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

buildscript {
    val korgeVersion: String by project

    repositories {
        mavenLocal()
        maven { url = uri("https://dl.bintray.com/korlibs/korlibs") }
        maven { url = uri("https://plugins.gradle.org/m2/") }
        mavenCentral()
        google()
    }
    dependencies {
        classpath("com.soywiz.korlibs.korge.plugins:korge-gradle-plugin:1.12.14.0")
        classpath("com.squareup.sqldelight:gradle-plugin:1.3.0")
    }
}

apply<KorgeGradlePlugin>()
plugins {
    kotlin("plugin.serialization") version "1.3.70"
}

val serialization_version = "0.20.0"

korge {
    id = "com.jollytechnologies.jollyphonics.adventure"
    supportBox2d()
}

kotlin.apply {
    project.korge.addDependency("commonMainImplementation", "org.jetbrains.kotlinx:kotlinx-serialization-runtime-common:$serialization_version")
    project.korge.addDependency("jvmMainImplementation", "org.jetbrains.kotlinx:kotlinx-serialization-runtime:$serialization_version")
    project.korge.addDependency("iosArm64MainImplementation", "org.jetbrains.kotlinx:kotlinx-serialization-runtime-native:$serialization_version")
    project.korge.addDependency("macosX64MainImplementation", "org.jetbrains.kotlinx:kotlinx-serialization-runtime-native:$serialization_version")
    project.korge.addDependency("iosArm32MainImplementation", "org.jetbrains.kotlinx:kotlinx-serialization-runtime-native:$serialization_version")
    project.korge.addDependency("iosX64MainImplementation", "org.jetbrains.kotlinx:kotlinx-serialization-runtime-native:$serialization_version")
    project.korge.addDependency("jsMainImplementation", "org.jetbrains.kotlinx:kotlinx-serialization-runtime-js:$serialization_version")
}
