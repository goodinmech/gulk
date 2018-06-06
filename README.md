Workflow для сборки и тестирования e-mail

* Шаблонизатор (juice https://www.npmjs.com/package/juice)
* Поддержка Foundation Inky (https://github.com/zurb/inky)
* Inline styles
* Отправка писем на почту
* Фикстуры
* Раскрытие HTML-like комментариев (<!--- <?php echo "Something for production" ?> ---> => <?php echo "Something for production" ?>)

### Установка
```
$ npm install
```

### Конфигурация (email, paths, prodFileExtension)
```
gulk/src/config.json
```

### Запуск
```
$ cd gulk/src
$ node start
```

##### Организация директории

/workflow
  * /dev
    Папка для верстки. Шаблоны, фикстуры, картинки, стили.
  * /test
    Сборка для тестовой отправки на e-mail (применяется фикстуры).
  * /prod
    Сборка для продакшена (применяется раскрытие HTML-like комментариев).

/src (исходный код gulk)

#### Фикстуры

Чтобы применить фикстуры к шаблону, нужно создать JSON файл с названием <имя_шаблона>.json со структурой:

```
{
  FIXTURE_NAME: "Lorem ipsum dolor sit amet, consectetur...",
  "<?php echo 40 + 2; ?>": 42,
  ...
}
```

Куски текст в шаблоне соответствующий ключам (```FIXTURE_NAME```, ```<?php echo 2 + 2; ?>```) будут заменены на их значение только в тестовых шаблонах (в папке test).

В шаблонах из папки prod такая замена не производится.

#### Раскрытие HTML-like комментариев

Комментарии будут расскрыты в шаблонах из папки prod, но не в test.

Dev/Test:

```
<!--- <?php echo "Something for production" ?> --->
```

Prod:

```
<?php echo "Something for production" ?>
```

### Команды

##### Сборка верстки писем

```
$ build
```

##### Автоматически собирать письма при изменении файлов верстки

```
$ watch
```

##### Выключить watch

```
$ nowatch
```

##### Установить пароль для smtpTransport (пароль не храниться на диске, его нужно вводить при новом запуске gulk

```
$ setEmailPass
$ Введите пароль: ******* // ввод не будет отображаться для безопасности
```

##### Отправить письма на почту
```
$ send
```

##### Очистить папку production и test

```
$ clear
```
