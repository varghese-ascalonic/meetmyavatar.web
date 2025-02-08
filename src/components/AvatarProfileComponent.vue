<template>
    <div class="avatar-profile">
        <img :src="avatarProfilePictureUrl" alt="Avatar Profile Picture" class="profile-picture" />
        <h2 class="avatar-name">{{ avatarName }}</h2>
    </div>
</template>

<script>
export default {
    name: 'AvatarProfileComponent',
    props: {
        avatarProfilePictureUrl: {
            type: String,
            required: true
        },
        avatarName: {
            type: String,
            required: true
        }
    }
};
</script>

<style scoped>
.avatar-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    /* Light background similar to WhatsApp's settings page */
    padding: 20px;
}

.profile-picture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #25D366;
    /* WhatsApp green accent */
    margin-bottom: 16px;
}

.avatar-name {
    font-size: 24px;
    font-weight: 500;
    color: #333;
}
</style>