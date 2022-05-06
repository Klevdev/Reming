## Reming changelog
---
**v0.0.0** - *05.05.22* 

Client-side:
* App created, based on [vitesse](https://github.com/antfu/vitesse) template
* Basic responsive default layout

Server-side:
* User authentication
* Creating account, login, logout, getting profile, deleting account

To Do:
* File uploading
* User privacy settings
* Querying users
---
**v0.0.1** - *06.05.22*

Server-side:
* Server now automatically sends refreshed tokens alongside requested data or error
* Added /user/refresh route for reauthenticating using refreshToken