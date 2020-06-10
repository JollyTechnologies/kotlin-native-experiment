package com.jollytechnologies.jollyphonicsadventure

import com.squareup.sqldelight.Query
import com.squareup.sqldelight.Transacter
import kotlin.Any
import kotlin.Long

interface Sound_groupQueries : Transacter {
  fun <T : Any> selectAll(mapper: (id: Long?, number: Long?) -> T): Query<T>

  fun selectAll(): Query<Sound_group>
}
