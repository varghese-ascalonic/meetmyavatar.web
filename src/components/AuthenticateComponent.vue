<template>
    <div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
            <div class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{{ heading }}</h2>
        </div>
        <form @submit.prevent="onNextClicked" class="mx-auto mt-16 max-w-xl sm:mt-20">
            <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                    <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                    <div class="mt-2.5">
                        <input type="email" name="email" id="email" autocomplete="email" v-model="userEmailModel"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
            </div>
            <br v-if="flow === 'LOGIN' || flow === 'SIGNUP'" />
            <div v-if="flow === 'LOGIN' || flow === 'SIGNUP'" class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                    <label for="password" class="block text-sm font-semibold leading-6 text-gray-900">Password</label>
                    <div class="mt-2.5">
                        <input type="password" name="password" id="password" v-model="password" @keydown="resetPasswordValidations"
                            :class="{'border-0': !passwordValidation.hasError, 'border-2 border-red-500': passwordValidation.hasError}"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        <label v-if="passwordValidation.hasError" class="block text-sm font-semibold leading-6 text-red-600">{{ passwordValidation.error }}</label>
                    </div>
                </div>
            </div>
            <br />
            <div v-if="flow === 'SIGNUP'" class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                    <label for="confirmPassword" class="block text-sm font-semibold leading-6 text-gray-900">Confirm Password</label>
                    <div class="mt-2.5">
                        <input type="password" name="confirmPassword" id="confirmPassword" v-model="confirmPassword" @keydown="resetConfirmPasswordValidations"
                            :class="{'border-0': !confirmPasswordValidation.hasError, 'border-2 border-red-500': confirmPasswordValidation.hasError}"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        <label v-if="confirmPasswordValidation.hasError" class="block text-sm font-semibold leading-6 text-red-600">{{ confirmPasswordValidation.error }}</label>
                    </div>
                </div>
            </div>
            <div class="mt-10">
                <button type="submit" class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
                
                <button @click="onBackClicked" v-if="flow !== 'DEFAULT'" style="margin-top: 10px;" class="block w-full rounded-md border border-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="mr-2">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14.5a.5.5 0 0 1 .5.5z" />
                    </svg>
                    Back
                </button>

                <button @click="onGoogleLoginClicked" style="margin-top: 10px;" class="block w-full rounded-md border border-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 flex items-center justify-center space-x-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google logo" width="20" height="20" class="mr-2" />
                    Continue with Google
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
    name: 'AuthenticateComponent',
    data() {
        return {
            password: '',
            confirmPassword: '',
            passwordValidation: {
                hasError: false,
                error: ''
            },
            confirmPasswordValidation: {
                hasError: false,
                error: ''
            }
        };
    },
    computed: {
        ...mapState('application', ['flow']), // Access the flow state from the 'application' store
        ...mapState('auth', ['user', 'userExists']),
        heading: {
            get() {
                switch (this.flow) {
                    case 'SIGNUP': return 'Come, Join us! It\'s fun!';
                    case 'LOGIN': return 'To be extra sure';
                    default: return 'Do we know you?';
                }
            }
        },
        userEmailModel: {
            get() {
                return this.user ? this.user.email : '';
            },
            set(value) {
                if (this.user) {
                    this.updateUser({ email: value });
                } else {
                    console.error('User object is not initialized.');
                }
            }
        },
    },
    methods: {
        ...mapActions('auth', ['checkUserExists', 'createAccount', 'login', 'getGoogleLoginUrl']), 
        ...mapMutations('auth', {
            updateUser: 'setUser'
        }),
        ...mapMutations('application', {
            setFlow: 'setFlow' // Mutation for setting the flow in the application store
        }),
        async onNextClicked() {
            if (this.validateInputs()) {
                if (this.flow === 'DEFAULT') {
                    await this.checkUserExists(this.userEmailModel);
                    this.setFlow(this.userExists ? 'LOGIN' : 'SIGNUP');
                } else if (this.flow === 'SIGNUP') {
                    this.createAccount({ email: this.userEmailModel, password: this.password, router: this.$router });
                    this.setFlow('DEFAULT');
                } else if (this.flow === 'LOGIN') {
                    this.login({ email: this.userEmailModel, password: this.password, router: this.$router });
                    this.setFlow('DEFAULT');
                }
            }
        },
        onBackClicked() {
            if (this.flow === 'SIGNUP' || this.flow === 'LOGIN') {
                this.setFlow('DEFAULT');
            }
        },
        validateInputs() {
            this.passwordValidation.hasError = false;
            this.confirmPasswordValidation.hasError = false;
            if (this.flow === 'DEFAULT') return true;
            if (this.password == null || this.password.trim() === '') {
                this.passwordValidation.hasError = true;
                this.passwordValidation.error = 'Enter a valid password';
                return false;
            }
            if (this.flow === 'LOGIN') return true;
            if (this.confirmPassword == null || this.confirmPassword.trim() === '') {
                this.confirmPasswordValidation.hasError = true;
                this.confirmPasswordValidation.error = 'Please repeat the password to confirm';
                return false;
            }
            if (this.confirmPassword !== this.password) {
                this.confirmPasswordValidation.hasError = true;
                this.confirmPasswordValidation.error = 'Password you repeated doesn\'t match!';
                return false;
            }
            return true;
        },
        resetPasswordValidations() {
            this.passwordValidation.hasError = false;
        },
        resetConfirmPasswordValidations() {
            this.confirmPasswordValidation.hasError = false;
        },
        async onGoogleLoginClicked() {
            try {
                // Fetch the Google login URL from the backend
                const googleLoginUrl = await this.getGoogleLoginUrl();

                // Redirect the user to the Google login page
                window.location.href = googleLoginUrl;
            } catch (error) {
                console.error('Failed to redirect to Google login:', error);
                alert('An error occurred while trying to log in with Google. Please try again.');
            }
        },
    }
}
</script>
