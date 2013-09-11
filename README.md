Diseño & Desarrollo de Videojuegos 2013
=======================================

Enlaces para aprender Git
--------------------------
* [Try Git](http://try.github.io)
  * Te enseña sobre Git mientras se puede ir probando comandos en una consola online. Utiliza además tu cuenta de GitHub para probar algunas cosas. **Idiomas:** Inglés.
* [Pro Git](http://git-scm.com/book/es)
  * Es una guía escrita por Scott Chacon (uno de los desarrolladores principales de Git) muy recomendada. Incluye gráficos explicativos. **Idiomas:** Español, Inglés y otros más.
* [Git Reference](http://gitref.org/)
  * Este sitio es, como dice el enlace, como para tomar de referencia cuando uno se olvida de algún comando, parámetros, acciones, etc. **Idiomas:** Inglés.


Git CheatSheet
---------------

Gente por ahi les sirve, si no saben como hacer algo tiene al tio google o me avisan! :)

Ver los cambios que hice
```
git diff
```

Deshacer todos los cambios
```
git reset --hard
```

Volver a un commit especifico
```
git reset --soft HEAD~”númeroHash”
```

En que branch estas:
```
git branch
```

Para setear el user en git
```
git config --global user.name="nombre de usuario" (entre comillas)
git config --global user.email=”email@” (entre comillas)
```

example:
```
git config --global user.name "Justo Vargas"
git config --global user.email "justomiguelvargas@gmail.com"
```


Para traer los ultimos cambios del server
```
git pull origin master
```

Para traer los ultimos cambios del server si ya tenes algo modificado primero debemos guardar en una pila los cambios y despues hacer el pull
```
git stash
git pull origin master
git stash pop
```

Para subir los cambios al server
```
git push origin master
```

para revertir el ultimo commit LOCAL
```
git reset --soft HEAD^
```

para revertir el commit hecho al server
```
git revert "HASH"
git push origin master
```

revertir los cambios locales hechos en un file dado
```
git checkout file
```

para verificar que los datos se cargaron correctamente:
```
git config --global --list
```
