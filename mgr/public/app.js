// @ts-check
// @ts-ignore
const { createApp, ref } = Vue;

createApp({
    setup() {
        // State
        const activeTab = ref('roles');
        const roles = ref([]);
        const users = ref([]);
        const aclRules = ref([]);
        const response = ref(null);

        // Forms
        const showAddRoleForm = ref(false);
        const newRole = ref({ id: null, p: null });

        const showAddUserForm = ref(false);
        const newUser = ref({ id: null, roles: '', attrib: '{}' });

        const showAddAclForm = ref(false);
        const newAclRule = ref({ entityId: null, userId: null, p: null });

        // Edit states
        const editedRole = ref(null);
        const editedUser = ref(null);
        const editedAclRule = ref(null);

        // Fetch data dynamically based on active tab
        const fetchData = async () => {
            const endpoints = {
                roles: '/api/get/roles',
                users: '/api/get/users',
                acl: '/api/get/acl'
            };

            try {
                const res = await fetch(endpoints[activeTab.value]);
                const data = await res.json().then(d => d.result);
                if (activeTab.value === 'roles') {
                    roles.value = data;
                } else if (activeTab.value === 'users') {
                    users.value = data;
                } else if (activeTab.value === 'acl') {
                    aclRules.value = data;
                }
            } catch (error) {
                response.value = { error: error.message };
            }
        };

        // Set active tab and fetch data
        const setActiveTab = (tab) => {
            activeTab.value = tab;
            fetchData();
        };

        // Helper function to handle API requests
        const handleApiRequest = async (url, method, body) => {
            try {
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                response.value = data;
                fetchData();
            } catch (error) {
                response.value = { error: error.message };
            }
        };

        // Add methods
        const addRole = () => {
            if (editedRole.value) return saveEditedRole();
            handleApiRequest('/api/add/role', 'POST', newRole.value);
            showAddRoleForm.value = false;
        };

        const addUser = () => {
            if (editedUser.value) return saveEditedUser();
            const userData = {
                id: newUser.value.id,
                roles: newUser.value.roles.split(','),
                attrib: JSON.parse(newUser.value.attrib)
            };
            handleApiRequest('/api/add/user', 'POST', userData);
            showAddUserForm.value = false;
        };

        const addAclRule = () => {
            if (editedAclRule.value) return saveEditedAclRule();
            handleApiRequest('/api/add/acl', 'POST', newAclRule.value);
            showAddAclForm.value = false;
        };

        // Edit methods
        const editRole = (role) => {
            editedRole.value = { ...role };
            newRole.value = { ...role };
            showAddRoleForm.value = true;
        };

        const editUser = (user) => {
            editedUser.value = { ...user };
            newUser.value = {
                id: user.id,
                roles: user.roles.join(','),
                attrib: JSON.stringify(user.attrib)
            };
            showAddUserForm.value = true;
        };

        const editAclRule = (rule) => {
            editedAclRule.value = { ...rule };
            newAclRule.value = { ...rule };
            showAddAclForm.value = true;
        };

        // Save edited data
        const saveEditedRole = () => {
            handleApiRequest(`/api/edit/role/${editedRole.value.id}`, 'PUT', newRole.value);
            editedRole.value = null; // Clear edit state
            showAddRoleForm.value = false;
        };

        const saveEditedUser = () => {
            const userData = {
                id: newUser.value.id,
                roles: newUser.value.roles.split(','),
                attrib: JSON.parse(newUser.value.attrib)
            };
            handleApiRequest(`/api/edit/user/${editedUser.value.id}`, 'PUT', userData);
            editedUser.value = null; // Clear edit state
            showAddUserForm.value = false;
        };

        const saveEditedAclRule = () => {
            handleApiRequest(`/api/edit/acl/${editedAclRule.value.entityId}`, 'PUT', newAclRule.value);
            editedAclRule.value = null; // Clear edit state
            showAddAclForm.value = false;
        };

        // Delete methods
        const deleteRole = (id) => {
            handleApiRequest(`/api/delete/role/${id}`, 'DELETE');
        };

        const deleteUser = (id) => {
            handleApiRequest(`/api/delete/user/${id}`, 'DELETE');
        };

        const deleteAclRule = (entityId) => {
            handleApiRequest(`/api/delete/acl/${entityId}`, 'DELETE');
        };

        // Initial data fetch
        fetchData();

        return {
            activeTab,
            roles,
            users,
            aclRules,
            response,
            showAddRoleForm,
            newRole,
            showAddUserForm,
            newUser,
            showAddAclForm,
            newAclRule,
            editedRole,
            editedUser,
            editedAclRule,
            setActiveTab,
            addRole,
            addUser,
            addAclRule,
            editRole,
            editUser,
            editAclRule,
            saveEditedRole,
            saveEditedUser,
            saveEditedAclRule,
            deleteRole,
            deleteUser,
            deleteAclRule
        };
    }
}).mount('#app');