export const treedata = {
    id: 'root',
    label: '根',
    children: [
        {
            id: '1',
            label: '一级',
            children: [
                {
                    id: '1-1',
                    label: '二级'
                },
                {
                    id: '1-2',
                    label: '二级',
                    children: [
                        {
                            id: '1-2-1',
                            label: '三级'
                        },
                        {
                            id: '1-2-2',
                            label: '三级'
                        }
                    ]
                }
            ]
        },
        {
            id: '2',
            label: '一级'
        },
        {
            id: '3',
            label: '一级',
            children: [
                {
                    id: '3-1',
                    label: '二级'
                },
                {
                    id: '3-2',
                    label: '二级',
                    children: [
                        {
                            id: '3-2-1',
                            label: '三级'
                        },
                        {
                            id: '3-2-2',
                            label: '三级'
                        },
                        {
                            id: '3-2-3',
                            label: '三级'
                        }
                    ]
                },
                {
                    id: '3-3',
                    label: '二级'
                }
            ]
        }
    ]
}
