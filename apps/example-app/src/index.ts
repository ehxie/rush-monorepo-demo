import { add } from '@rush-monorepo-demo/my-toolchain'
const main = () => {
    console.log('Hello World');

    console.log(`sum: ${add(1, 2)}`);
}

main()