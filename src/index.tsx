import { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import * as esbuild from 'esbuild-wasm';

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container!); 

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    const startService = async () => {
        const service = await esbuild.initialize({
            worker: true, 
            wasmURL: '/esbuild.wasm'
        })
        console.log(service);
    };

    useEffect(() => {
        try {
            // startService();
            esbuild.build({});
        } catch (error) {
            if (error instanceof Error && error.message.includes('initialize')) {
                esbuild.initialize({
                    worker: false,
                    wasmURL: '/esbuild.wasm',
                });
            } else {
                throw error;
            }
        }
    }, []);

    const onClick = async () => {
        console.log(input);
       esbuild
        .transform(input, {
            loader: 'tsx',
            target: 'es2015',
        })
        .then((result) => {
            setCode(result.code);
        });
    };

    return <div>
        <textarea value={input} onChange={ e => setInput(e.target.value)}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>

        <pre>{code}</pre>
    </div>
};


root.render(<App />);