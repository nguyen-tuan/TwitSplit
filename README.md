*This page has 2 main components:
Component1(history-command): store commands and notification of command.
Component2(input): the users type characters.

*During the process of taking the test, I have some problem:

-command LPOP( remove and return the first item of the list ): "remove" here is remove the key or is remove elements from the list except the first element. Command RPOP is the same problem.

-command EXPIRE: set timeout for keykey, it means when query this key will wait for a number of seconds equal to the number of seconds of the timeout to appear.

-command SAVE (save current state in a snapshot): curent state is key and value or is history-command? where it store?
-command RESTORE: don't know how to do it :'( :'(.

-command SINTER: interested with this command.

-I have many ideas to implement(examplemple: press arrow-up to get previous command, arrow-down to clear command) but there are some problems so I can't do it. 
