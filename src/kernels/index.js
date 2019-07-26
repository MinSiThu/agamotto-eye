let Kernels = {
    sharpenKernel:[  
        0, -1,  0,
        -1,  5, -1,
         0, -1,  0 
    ],
    sobelHorizontalKernel:[
                -1,0,1,	
                -5,0,5,	
                -1,0,1
    ],
    sobelVerticalKernel:[
                -1,-5,-1,	
                0,0,0,	
                1,5,1
    ],
    edgeDetectorKernel:[ // Laplacian Operator
                0,-1,0,
                -1,4,-1,
                0,-1,0
    ]
}

module.exports = Kernels;