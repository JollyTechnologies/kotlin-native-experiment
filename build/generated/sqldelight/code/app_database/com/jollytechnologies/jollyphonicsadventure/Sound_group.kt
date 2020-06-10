package com.jollytechnologies.jollyphonicsadventure

import kotlin.Long
import kotlin.String

interface Sound_group {
  val id: Long?

  val number: Long?

  data class Impl(
    override val id: Long?,
    override val number: Long?
  ) : Sound_group {
    override fun toString(): String = """
    |Sound_group.Impl [
    |  id: $id
    |  number: $number
    |]
    """.trimMargin()
  }
}
