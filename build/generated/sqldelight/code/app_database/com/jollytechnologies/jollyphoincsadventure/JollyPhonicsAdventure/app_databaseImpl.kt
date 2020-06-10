package com.jollytechnologies.jollyphoincsadventure.JollyPhonicsAdventure

import com.jollytechnologies.jollyphoincsadventure.app_database
import com.jollytechnologies.jollyphonicsadventure.Sound_group
import com.jollytechnologies.jollyphonicsadventure.Sound_groupQueries
import com.squareup.sqldelight.Query
import com.squareup.sqldelight.TransacterImpl
import com.squareup.sqldelight.db.SqlDriver
import com.squareup.sqldelight.internal.copyOnWriteList
import kotlin.Any
import kotlin.Int
import kotlin.Long
import kotlin.collections.MutableList
import kotlin.reflect.KClass

internal val KClass<app_database>.schema: SqlDriver.Schema
  get() = app_databaseImpl.Schema

internal fun KClass<app_database>.newInstance(driver: SqlDriver): app_database =
    app_databaseImpl(driver)

private class app_databaseImpl(
  driver: SqlDriver
) : TransacterImpl(driver), app_database {
  override val sound_groupQueries: Sound_groupQueriesImpl = Sound_groupQueriesImpl(this, driver)

  object Schema : SqlDriver.Schema {
    override val version: Int
      get() = 1

    override fun create(driver: SqlDriver) {
      driver.execute(null,
          "CREATE TABLE IF NOT EXISTS sound_group (id INTEGER, number INTEGER, PRIMARY KEY (id))",
          0)
    }

    override fun migrate(
      driver: SqlDriver,
      oldVersion: Int,
      newVersion: Int
    ) {
    }
  }
}

private class Sound_groupQueriesImpl(
  private val database: app_databaseImpl,
  private val driver: SqlDriver
) : TransacterImpl(driver), Sound_groupQueries {
  internal val selectAll: MutableList<Query<*>> = copyOnWriteList()

  override fun <T : Any> selectAll(mapper: (id: Long?, number: Long?) -> T): Query<T> =
      Query(-1636678499, selectAll, driver, "sound_group.sq", "selectAll",
      "SELECT * FROM sound_group") { cursor ->
    mapper(
      cursor.getLong(0),
      cursor.getLong(1)
    )
  }

  override fun selectAll(): Query<Sound_group> = selectAll(Sound_group::Impl)
}
