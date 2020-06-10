package com.jollytechnologies.jollyphoincsadventure

import com.jollytechnologies.jollyphoincsadventure.JollyPhonicsAdventure.newInstance
import com.jollytechnologies.jollyphoincsadventure.JollyPhonicsAdventure.schema
import com.jollytechnologies.jollyphonicsadventure.Sound_groupQueries
import com.squareup.sqldelight.Transacter
import com.squareup.sqldelight.db.SqlDriver

interface app_database : Transacter {
  val sound_groupQueries: Sound_groupQueries

  companion object {
    val Schema: SqlDriver.Schema
      get() = app_database::class.schema

    operator fun invoke(driver: SqlDriver): app_database = app_database::class.newInstance(driver)}
}
