export default function InputData({ onTokenSubmit }) { // Changed to 'onTokenSubmit'
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const tokenVal = e.target.elements.inputData.value;
        // Call the prop with the correct name
        onTokenSubmit(tokenVal); 
    };

    return (
        <>
            <div className="m-4">
                <form action="" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="inputData"
                        id="inputData"
                        className="border border-gray-300 p-2 rounded"
                        placeholder="Enter your token"
                    />
                    <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">Submit</button>
                </form>
            </div>
        </>
    );
}