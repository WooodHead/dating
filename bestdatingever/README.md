Layouts
-


For pages components you can add dynamic and nested layouts.<br>
Example for "UsersPage" component and "UsersLayout":

```
function UsersLayout() {...}
function UsersPage() {...}

UsersPage.layouts = [UsersLayout]
```


This code will render:
```
<UsersLayout>
    <UsersPage/>
</UsersLayout>
```


Value like = [UsersLayout, OtherLayout] will render: 

```
<UsersLayout>
    <OtherLayout>
        <UsersPage/>
    </OtherLayout>
</UsersLayout>
```

To pass props to layouts you should use next way: 

```
UsersPage.layouts = [{component: UsersLayout, props: {x: 'y'}}]
<UsersLayout x={'y'}>
    <UsersPage/>
</UsersLayout>
```

Handling access to pages for users
-

Available options for pages visibility = 'public' || 'private' || 'all'<br>
- public - only for unauthorized users<br>
- private - only for authorized users<br>
- all - for all users<br>

By default page has 'private' visibility<br>
To set other, use:

```
UsersPage.accessMode = 'all'
```

