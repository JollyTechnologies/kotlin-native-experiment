(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', 'kotlin'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('kotlin'));
  else {
    if (typeof kotlin === 'undefined') {
      throw new Error("Error loading module 'sqldelight-runtime'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'sqldelight-runtime'.");
    }root['sqldelight-runtime'] = factory(typeof this['sqldelight-runtime'] === 'undefined' ? {} : this['sqldelight-runtime'], kotlin);
  }
}(this, function (_, Kotlin) {
  'use strict';
  var $$importsForInline$$ = _.$$importsForInline$$ || (_.$$importsForInline$$ = {});
  var Kind_INTERFACE = Kotlin.Kind.INTERFACE;
  var equals = Kotlin.equals;
  var Kind_CLASS = Kotlin.Kind.CLASS;
  var defineInlineFunction = Kotlin.defineInlineFunction;
  var wrapFunction = Kotlin.wrapFunction;
  var NoSuchElementException_init = Kotlin.kotlin.NoSuchElementException;
  var NullPointerException = Kotlin.kotlin.NullPointerException;
  var IllegalStateException_init = Kotlin.kotlin.IllegalStateException_init_pdl1vj$;
  var ArrayList_init = Kotlin.kotlin.collections.ArrayList_init_287e2$;
  var Throwable = Error;
  var PropertyMetadata = Kotlin.PropertyMetadata;
  var ensureNotNull = Kotlin.ensureNotNull;
  var toString = Kotlin.toString;
  var distinct = Kotlin.kotlin.collections.distinct_7wnvza$;
  var StringBuilder_init = Kotlin.kotlin.text.StringBuilder_init_za3lpa$;
  var addAll = Kotlin.kotlin.collections.addAll_ipc267$;
  var Math_0 = Math;
  var roundToInt = Kotlin.kotlin.math.roundToInt_yrwdxr$;
  var Unit = Kotlin.kotlin.Unit;
  var toList = Kotlin.kotlin.collections.toList_7wnvza$;
  var LinkedHashSet_init = Kotlin.kotlin.collections.LinkedHashSet_init_287e2$;
  var LinkedHashMap_init = Kotlin.kotlin.collections.LinkedHashMap_init_q3lmfv$;
  SimpleQuery.prototype = Object.create(Query_1.prototype);
  SimpleQuery.prototype.constructor = SimpleQuery;
  RollbackException.prototype = Object.create(Throwable.prototype);
  RollbackException.prototype.constructor = RollbackException;
  AtomicBoolean.prototype = Object.create(Atomic.prototype);
  AtomicBoolean.prototype.constructor = AtomicBoolean;
  function ColumnAdapter() {
  }
  ColumnAdapter.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'ColumnAdapter',
    interfaces: []
  };
  function EnumColumnAdapter(enumValues) {
    this.enumValues_0 = enumValues;
  }
  EnumColumnAdapter.prototype.decode_11rc$ = function (databaseValue) {
    var $receiver = this.enumValues_0;
    var first$result;
    first$break: do {
      var tmp$;
      for (tmp$ = 0; tmp$ !== $receiver.length; ++tmp$) {
        var element = $receiver[tmp$];
        if (equals(element.name, databaseValue)) {
          first$result = element;
          break first$break;
        }}
      throw new NoSuchElementException_init('Array contains no element matching the predicate.');
    }
     while (false);
    return first$result;
  };
  EnumColumnAdapter.prototype.encode_trkh7z$ = function (value) {
    return value.name;
  };
  EnumColumnAdapter.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'EnumColumnAdapter',
    interfaces: [ColumnAdapter]
  };
  var EnumColumnAdapter_0 = defineInlineFunction('sqldelight-runtime.com.squareup.sqldelight.EnumColumnAdapter_nxd2ia$', wrapFunction(function () {
    var EnumColumnAdapter_init = _.com.squareup.sqldelight.EnumColumnAdapter;
    return function (T_0, isT) {
      return new EnumColumnAdapter_init(T_0.values());
    };
  }));
  function Query(identifier, queries, driver, query, mapper) {
    return Query_0(identifier, queries, driver, 'unknown', 'unknown', query, mapper);
  }
  function Query_0(identifier, queries, driver, fileName, label, query, mapper) {
    return new SimpleQuery(identifier, queries, driver, fileName, label, query, mapper);
  }
  function SimpleQuery(identifier, queries, driver, fileName, label, query, mapper) {
    Query_1.call(this, queries, mapper);
    this.identifier_0 = identifier;
    this.driver_0 = driver;
    this.fileName_0 = fileName;
    this.label_0 = label;
    this.query_0 = query;
  }
  SimpleQuery.prototype.execute = function () {
    return this.driver_0.executeQuery_y7hrwn$(this.identifier_0, this.query_0, 0);
  };
  SimpleQuery.prototype.toString = function () {
    return this.fileName_0 + ':' + this.label_0;
  };
  SimpleQuery.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'SimpleQuery',
    interfaces: [Query_1]
  };
  function Query_1(queries, mapper) {
    this.queries_hw8ylk$_0 = queries;
    this.mapper = mapper;
    this.listenerLock_2fvhhz$_0 = new QueryLock();
    this.listeners_gc8bvj$_0 = sharedSet();
  }
  Query_1.prototype.notifyDataChanged = function () {
    var tmp$;
    tmp$ = this.listeners_gc8bvj$_0.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      element.queryResultsChanged();
    }
  };
  Query_1.prototype.addListener_oql060$ = function (listener) {
    if (this.listeners_gc8bvj$_0.isEmpty())
      this.queries_hw8ylk$_0.add_11rb$(this);
    this.listeners_gc8bvj$_0.add_11rb$(listener);
  };
  Query_1.prototype.removeListener_oql060$ = function (listener) {
    this.listeners_gc8bvj$_0.remove_11rb$(listener);
    if (this.listeners_gc8bvj$_0.isEmpty())
      this.queries_hw8ylk$_0.remove_11rb$(this);
  };
  Query_1.prototype.executeAsList = function () {
    var result = ArrayList_init();
    var $receiver = this.execute();
    var exception = null;
    try {
      while ($receiver.next())
        result.add_11rb$(this.mapper($receiver));
    } catch (e) {
      if (Kotlin.isType(e, Throwable)) {
        exception = e;
        throw e;
      } else
        throw e;
    }
    finally {
      if ($receiver != null)
        if (exception == null)
          $receiver.close();
        else
          try {
            $receiver.close();
          } catch (closeException) {
            if (!Kotlin.isType(closeException, Throwable))
              throw closeException;
          }
    }
    return result;
  };
  Query_1.prototype.executeAsOne = function () {
    var tmp$;
    tmp$ = this.executeAsOneOrNull();
    if (tmp$ == null) {
      throw new NullPointerException('ResultSet returned null for ' + this);
    }return tmp$;
  };
  Query_1.prototype.executeAsOneOrNull = function () {
    var $receiver = this.execute();
    var exception = null;
    try {
      if (!$receiver.next())
        return null;
      var item = this.mapper($receiver);
      if ($receiver.next()) {
        throw IllegalStateException_init('ResultSet returned more than 1 row for ' + this);
      }return item;
    } catch (e) {
      if (Kotlin.isType(e, Throwable)) {
        exception = e;
        throw e;
      } else
        throw e;
    }
    finally {
      if ($receiver != null)
        if (exception == null)
          $receiver.close();
        else
          try {
            $receiver.close();
          } catch (closeException) {
            if (!Kotlin.isType(closeException, Throwable))
              throw closeException;
          }
    }
  };
  function Query$Listener() {
  }
  Query$Listener.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'Listener',
    interfaces: []
  };
  Query_1.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Query',
    interfaces: []
  };
  function run($receiver) {
    return $receiver()();
  }
  function Transacter() {
  }
  Transacter.prototype.transaction_8xof35$ = function (noEnclosing, body, callback$default) {
    if (noEnclosing === void 0)
      noEnclosing = false;
    callback$default ? callback$default(noEnclosing, body) : this.transaction_8xof35$$default(noEnclosing, body);
  };
  function Transacter$Transaction() {
    this.postCommitHooks_8be2vx$ = sharedSet();
    this.postRollbackHooks_8be2vx$ = sharedSet();
    this.queriesFuncs_8be2vx$ = sharedMap();
    this.successful_8be2vx$_nwnznv$_0 = new AtomicBoolean(false);
    this.childrenSuccessful_8be2vx$_4bwek$_0 = new AtomicBoolean(true);
    this.transacter_8be2vx$_9lf6he$_0 = new Atomic(null);
  }
  var Transacter$Transaction$successful_metadata = new PropertyMetadata('successful');
  Object.defineProperty(Transacter$Transaction.prototype, 'successful_8be2vx$', {
    get: function () {
      return getValue(this.successful_8be2vx$_nwnznv$_0, this, Transacter$Transaction$successful_metadata);
    },
    set: function (successful) {
      setValue(this.successful_8be2vx$_nwnznv$_0, this, Transacter$Transaction$successful_metadata, successful);
    }
  });
  var Transacter$Transaction$childrenSuccessful_metadata = new PropertyMetadata('childrenSuccessful');
  Object.defineProperty(Transacter$Transaction.prototype, 'childrenSuccessful_8be2vx$', {
    get: function () {
      return getValue(this.childrenSuccessful_8be2vx$_4bwek$_0, this, Transacter$Transaction$childrenSuccessful_metadata);
    },
    set: function (childrenSuccessful) {
      setValue(this.childrenSuccessful_8be2vx$_4bwek$_0, this, Transacter$Transaction$childrenSuccessful_metadata, childrenSuccessful);
    }
  });
  var Transacter$Transaction$transacter_metadata = new PropertyMetadata('transacter');
  Object.defineProperty(Transacter$Transaction.prototype, 'transacter_8be2vx$', {
    get: function () {
      return getValue_0(this.transacter_8be2vx$_9lf6he$_0, this, Transacter$Transaction$transacter_metadata);
    },
    set: function (transacter) {
      setValue_0(this.transacter_8be2vx$_9lf6he$_0, this, Transacter$Transaction$transacter_metadata, transacter);
    }
  });
  Transacter$Transaction.prototype.enclosingTransaction_8be2vx$ = function () {
    return this.enclosingTransaction;
  };
  Transacter$Transaction.prototype.endTransaction_8be2vx$ = function () {
    this.endTransaction_6taknv$(this.successful_8be2vx$ && this.childrenSuccessful_8be2vx$);
  };
  Transacter$Transaction.prototype.rollback = function () {
    throw new RollbackException();
  };
  Transacter$Transaction.prototype.afterCommit_o14v8n$ = function (function_0) {
    this.postCommitHooks_8be2vx$.add_11rb$(threadLocalRef(function_0));
  };
  Transacter$Transaction.prototype.afterRollback_o14v8n$ = function (function_0) {
    this.postRollbackHooks_8be2vx$.add_11rb$(threadLocalRef(function_0));
  };
  Transacter$Transaction.prototype.transaction_zfb502$ = function (body) {
    ensureNotNull(this.transacter_8be2vx$).transaction_8xof35$(false, body);
  };
  Transacter$Transaction.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Transaction',
    interfaces: []
  };
  Transacter.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'Transacter',
    interfaces: []
  };
  function RollbackException() {
    Throwable.call(this);
    this.message_11bw3w$_0 = void 0;
    this.cause_2dgatu$_0 = null;
    Kotlin.captureStack(Throwable, this);
    this.name = 'RollbackException';
  }
  Object.defineProperty(RollbackException.prototype, 'message', {
    get: function () {
      return this.message_11bw3w$_0;
    }
  });
  Object.defineProperty(RollbackException.prototype, 'cause', {
    get: function () {
      return this.cause_2dgatu$_0;
    }
  });
  RollbackException.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'RollbackException',
    interfaces: [Throwable]
  };
  function TransacterImpl(driver) {
    this.driver_f3t1d3$_0 = driver;
  }
  TransacterImpl.prototype.notifyQueries_y0kj9x$ = function (identifier, queryList) {
    var transaction = this.driver_f3t1d3$_0.currentTransaction();
    if (transaction != null) {
      if (!transaction.queriesFuncs_8be2vx$.containsKey_11rb$(identifier)) {
        var $receiver = transaction.queriesFuncs_8be2vx$;
        var value = threadLocalRef(queryList);
        $receiver.put_xwzc9p$(identifier, value);
      }} else {
      var tmp$;
      tmp$ = queryList().iterator();
      while (tmp$.hasNext()) {
        var element = tmp$.next();
        element.notifyDataChanged();
      }
    }
  };
  TransacterImpl.prototype.createArguments_vux9f0$ = function (count, offset) {
    if (count === 0)
      return '()';
    var $receiver = StringBuilder_init(presizeArguments(count, offset));
    var tmp$;
    $receiver.append_61zpoe$('(?');
    $receiver.append_s8jyv4$(offset);
    tmp$ = offset + count | 0;
    for (var value = offset + 1 | 0; value < tmp$; value++) {
      $receiver.append_61zpoe$(',?');
      $receiver.append_s8jyv4$(value);
    }
    $receiver.append_s8itvh$(41);
    return $receiver.toString();
  };
  TransacterImpl.prototype.transaction_8xof35$$default = function (noEnclosing, body) {
    var transaction = this.driver_f3t1d3$_0.newTransaction();
    var enclosing = transaction.enclosingTransaction_8be2vx$();
    if (enclosing != null && noEnclosing) {
      throw IllegalStateException_init('Already in a transaction');
    }var thrownException = {v: null};
    try {
      transaction.transacter_8be2vx$ = this;
      body(transaction);
      transaction.successful_8be2vx$ = true;
    } catch (e) {
      if (Kotlin.isType(e, RollbackException)) {
        if (enclosing != null)
          throw e;
        thrownException.v = e;
      } else if (Kotlin.isType(e, Throwable)) {
        thrownException.v = e;
      } else
        throw e;
    }
    finally {
      transaction.endTransaction_8be2vx$();
      if (enclosing == null) {
        if (!transaction.successful_8be2vx$ || !transaction.childrenSuccessful_8be2vx$) {
          try {
            var tmp$;
            tmp$ = transaction.postRollbackHooks_8be2vx$.iterator();
            while (tmp$.hasNext()) {
              var element = tmp$.next();
              run(element);
            }
          } catch (rollbackException) {
            if (Kotlin.isType(rollbackException, Throwable)) {
              if (thrownException.v != null) {
                var closure$rollbackException = rollbackException;
                throw Kotlin.newThrowable('Exception while rolling back from an exception.' + '\n' + 'Original exception: ' + toString(thrownException.v) + '\n' + 'with cause ' + toString(thrownException.v.cause) + '\n' + '\n' + 'Rollback exception: ' + closure$rollbackException, closure$rollbackException);
              }throw rollbackException;
            } else
              throw rollbackException;
          }
          transaction.postRollbackHooks_8be2vx$.clear();
        } else {
          var $receiver = transaction.queriesFuncs_8be2vx$;
          var destination = ArrayList_init();
          var tmp$_0;
          tmp$_0 = $receiver.entries.iterator();
          while (tmp$_0.hasNext()) {
            var element_0 = tmp$_0.next();
            var queryListSupplier = element_0.value;
            var list = run(queryListSupplier);
            addAll(destination, list);
          }
          var tmp$_1;
          tmp$_1 = distinct(destination).iterator();
          while (tmp$_1.hasNext()) {
            var element_1 = tmp$_1.next();
            element_1.notifyDataChanged();
          }
          transaction.queriesFuncs_8be2vx$.clear();
          var tmp$_2;
          tmp$_2 = transaction.postCommitHooks_8be2vx$.iterator();
          while (tmp$_2.hasNext()) {
            var element_2 = tmp$_2.next();
            run(element_2);
          }
          transaction.postCommitHooks_8be2vx$.clear();
        }
      } else {
        enclosing.childrenSuccessful_8be2vx$ = (transaction.successful_8be2vx$ && transaction.childrenSuccessful_8be2vx$);
        enclosing.postCommitHooks_8be2vx$.addAll_brywnq$(transaction.postCommitHooks_8be2vx$);
        enclosing.postRollbackHooks_8be2vx$.addAll_brywnq$(transaction.postRollbackHooks_8be2vx$);
        enclosing.queriesFuncs_8be2vx$.putAll_a2k3zr$(transaction.queriesFuncs_8be2vx$);
      }
      if (thrownException.v != null && !Kotlin.isType(thrownException.v, RollbackException)) {
        throw thrownException.v;
      }}
  };
  TransacterImpl.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'TransacterImpl',
    interfaces: [Transacter]
  };
  function SqlCursor() {
  }
  SqlCursor.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'SqlCursor',
    interfaces: [Closeable]
  };
  function SqlDriver() {
  }
  SqlDriver.prototype.executeQuery_y7hrwn$ = function (identifier, sql, parameters, binders, callback$default) {
    if (binders === void 0)
      binders = null;
    return callback$default ? callback$default(identifier, sql, parameters, binders) : this.executeQuery_y7hrwn$$default(identifier, sql, parameters, binders);
  };
  SqlDriver.prototype.execute_y7hrwn$ = function (identifier, sql, parameters, binders, callback$default) {
    if (binders === void 0)
      binders = null;
    callback$default ? callback$default(identifier, sql, parameters, binders) : this.execute_y7hrwn$$default(identifier, sql, parameters, binders);
  };
  function SqlDriver$Schema() {
  }
  SqlDriver$Schema.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'Schema',
    interfaces: []
  };
  SqlDriver.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'SqlDriver',
    interfaces: [Closeable]
  };
  function SqlPreparedStatement() {
  }
  SqlPreparedStatement.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'SqlPreparedStatement',
    interfaces: []
  };
  function getValue($receiver, thisRef, prop) {
    return $receiver.get();
  }
  function setValue($receiver, thisRef, prop, value) {
    $receiver.set_11rb$(value);
  }
  function getValue_0($receiver, thisRef, prop) {
    return $receiver.get();
  }
  function setValue_0($receiver, thisRef, prop, value) {
    $receiver.set_11rb$(value);
  }
  function presizeArguments(count, offset) {
    var size = 0;
    var currentBase = 0;
    var n = currentBase;
    var pow = roundToInt(Math_0.pow(10.0, n));
    var lastPow;
    while ((offset + count | 0) > pow) {
      lastPow = pow;
      var n_0 = (currentBase = currentBase + 1 | 0, currentBase);
      pow = roundToInt(Math_0.pow(10.0, n_0));
      var tmp$ = size;
      var tmp$_0 = currentBase + 1 | 0;
      var a = pow;
      var b = offset + count | 0;
      var tmp$_1 = Math_0.min(a, b);
      var a_0 = pow;
      var b_0 = Math_0.min(a_0, offset);
      size = tmp$ + Kotlin.imul(tmp$_0, tmp$_1 - Math_0.max(lastPow, b_0) | 0) | 0;
    }
    return size + 2 + ((count - 1 | 0) * 2 | 0) | 0;
  }
  function LogSqliteDriver(sqlDriver, logger) {
    this.sqlDriver_0 = sqlDriver;
    this.logger_0 = logger;
  }
  LogSqliteDriver.prototype.currentTransaction = function () {
    return this.sqlDriver_0.currentTransaction();
  };
  LogSqliteDriver.prototype.execute_y7hrwn$$default = function (identifier, sql, parameters, binders) {
    this.logger_0('EXECUTE' + '\n' + ' ' + sql);
    this.logParameters_0(binders);
    this.sqlDriver_0.execute_y7hrwn$(identifier, sql, parameters, binders);
  };
  LogSqliteDriver.prototype.executeQuery_y7hrwn$$default = function (identifier, sql, parameters, binders) {
    this.logger_0('QUERY' + '\n' + ' ' + sql);
    this.logParameters_0(binders);
    return this.sqlDriver_0.executeQuery_y7hrwn$(identifier, sql, parameters, binders);
  };
  function LogSqliteDriver$newTransaction$lambda(this$LogSqliteDriver) {
    return function () {
      this$LogSqliteDriver.logger_0('TRANSACTION COMMIT');
      return Unit;
    };
  }
  function LogSqliteDriver$newTransaction$lambda_0(this$LogSqliteDriver) {
    return function () {
      this$LogSqliteDriver.logger_0('TRANSACTION ROLLBACK');
      return Unit;
    };
  }
  LogSqliteDriver.prototype.newTransaction = function () {
    this.logger_0('TRANSACTION BEGIN');
    var transaction = this.sqlDriver_0.newTransaction();
    transaction.afterCommit_o14v8n$(LogSqliteDriver$newTransaction$lambda(this));
    transaction.afterRollback_o14v8n$(LogSqliteDriver$newTransaction$lambda_0(this));
    return transaction;
  };
  LogSqliteDriver.prototype.close = function () {
    this.logger_0('CLOSE CONNECTION');
    this.sqlDriver_0.close();
  };
  LogSqliteDriver.prototype.logParameters_0 = function (binders) {
    if (binders != null) {
      var parametersInterceptor = new StatementParameterInterceptor();
      binders(parametersInterceptor);
      var logParameters = parametersInterceptor.getAndClearParameters();
      if (!logParameters.isEmpty())
        this.logger_0(' ' + logParameters);
    }};
  LogSqliteDriver.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'LogSqliteDriver',
    interfaces: [SqlDriver]
  };
  function StatementParameterInterceptor() {
    this.values_0 = ArrayList_init();
  }
  StatementParameterInterceptor.prototype.bindBytes_z5wsk1$ = function (index, value) {
    this.values_0.add_11rb$(value);
  };
  StatementParameterInterceptor.prototype.bindDouble_tvwy6j$ = function (index, value) {
    this.values_0.add_11rb$(value);
  };
  StatementParameterInterceptor.prototype.bindLong_280ow0$ = function (index, value) {
    this.values_0.add_11rb$(value);
  };
  StatementParameterInterceptor.prototype.bindString_vqvrqt$ = function (index, value) {
    this.values_0.add_11rb$(value);
  };
  StatementParameterInterceptor.prototype.getAndClearParameters = function () {
    var list = toList(this.values_0);
    this.values_0.clear();
    return list;
  };
  StatementParameterInterceptor.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'StatementParameterInterceptor',
    interfaces: [SqlPreparedStatement]
  };
  function Closeable() {
  }
  Closeable.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'Closeable',
    interfaces: []
  };
  var use = defineInlineFunction('sqldelight-runtime.com.squareup.sqldelight.db.use_hcg30c$', wrapFunction(function () {
    var Throwable = Error;
    return function ($receiver, body) {
      var exception = null;
      try {
        return body($receiver);
      } catch (e) {
        if (Kotlin.isType(e, Throwable)) {
          exception = e;
          throw e;
        } else
          throw e;
      }
      finally {
        if ($receiver != null)
          if (exception == null)
            $receiver.close();
          else
            try {
              $receiver.close();
            } catch (closeException) {
              if (!Kotlin.isType(closeException, Throwable))
                throw closeException;
            }
      }
    };
  }));
  function Atomic(value) {
    this.value_rzmcs9$_0 = value;
  }
  Atomic.prototype.get = function () {
    return this.value_rzmcs9$_0;
  };
  Atomic.prototype.set_11rb$ = function (value) {
    this.value_rzmcs9$_0 = value;
  };
  Atomic.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Atomic',
    interfaces: []
  };
  function AtomicBoolean(value) {
    Atomic.call(this, value);
  }
  AtomicBoolean.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'AtomicBoolean',
    interfaces: [Atomic]
  };
  function copyOnWriteList() {
    return ArrayList_init();
  }
  function QueryLock() {
  }
  QueryLock.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'QueryLock',
    interfaces: []
  };
  var withLock = defineInlineFunction('sqldelight-runtime.com.squareup.sqldelight.internal.withLock_hcv47m$', function ($receiver, block) {
    return block();
  });
  function threadLocalRef$lambda(closure$value) {
    return function () {
      return closure$value;
    };
  }
  function threadLocalRef(value) {
    return threadLocalRef$lambda(value);
  }
  function sharedSet() {
    return LinkedHashSet_init();
  }
  function sharedMap() {
    return LinkedHashMap_init();
  }
  var package$com = _.com || (_.com = {});
  var package$squareup = package$com.squareup || (package$com.squareup = {});
  var package$sqldelight = package$squareup.sqldelight || (package$squareup.sqldelight = {});
  package$sqldelight.ColumnAdapter = ColumnAdapter;
  package$sqldelight.EnumColumnAdapter = EnumColumnAdapter;
  package$sqldelight.Query_gya3xh$ = Query;
  package$sqldelight.Query_79dncn$ = Query_0;
  $$importsForInline$$['sqldelight-runtime'] = _;
  Query_1.Listener = Query$Listener;
  package$sqldelight.Query = Query_1;
  Transacter.Transaction = Transacter$Transaction;
  package$sqldelight.Transacter = Transacter;
  package$sqldelight.TransacterImpl = TransacterImpl;
  var package$db = package$sqldelight.db || (package$sqldelight.db = {});
  package$db.SqlCursor = SqlCursor;
  SqlDriver.Schema = SqlDriver$Schema;
  package$db.SqlDriver = SqlDriver;
  package$db.SqlPreparedStatement = SqlPreparedStatement;
  var package$internal = package$sqldelight.internal || (package$sqldelight.internal = {});
  package$internal.getValue_1g55c6$ = getValue;
  package$internal.setValue_t65kr1$ = setValue;
  package$internal.getValue_mi018w$ = getValue_0;
  package$internal.setValue_uek1nu$ = setValue_0;
  package$internal.presizeArguments_6xvm5r$ = presizeArguments;
  var package$logs = package$sqldelight.logs || (package$sqldelight.logs = {});
  package$logs.LogSqliteDriver = LogSqliteDriver;
  package$logs.StatementParameterInterceptor = StatementParameterInterceptor;
  package$db.Closeable = Closeable;
  package$db.use_hcg30c$ = use;
  package$internal.Atomic = Atomic;
  package$internal.AtomicBoolean = AtomicBoolean;
  package$internal.copyOnWriteList = copyOnWriteList;
  package$internal.QueryLock = QueryLock;
  package$internal.withLock_hcv47m$ = withLock;
  package$internal.threadLocalRef_41v7ql$ = threadLocalRef;
  package$internal.sharedSet_tnbmyv$ = sharedSet;
  package$internal.sharedMap_3w54xu$ = sharedMap;
  TransacterImpl.prototype.transaction_8xof35$ = Transacter.prototype.transaction_8xof35$;
  LogSqliteDriver.prototype.execute_y7hrwn$ = SqlDriver.prototype.execute_y7hrwn$;
  LogSqliteDriver.prototype.executeQuery_y7hrwn$ = SqlDriver.prototype.executeQuery_y7hrwn$;
  Kotlin.defineModule('sqldelight-runtime', _);
  return _;
}));

//# sourceMappingURL=sqldelight-runtime.js.map
