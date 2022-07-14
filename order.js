function orderPrioritise(entities)
{
    var threshold = entities[Math.floor(entities.length/2)]
    var bigger = []
    var smaller = []
    var item = 0
    if(entities.length == 1)
    {
        return entities;
    }
    for(const element of entities)
    {
        item = element
        if(item < threshold)
        {
            smaller.unshift(item)       
        }
        else if(item == threshold)
        {
            smaller.push(item)
        }
        else
        {
            bigger.push(item)
        }
    }
    if(bigger.length == 0 && smaller.length != 0)
    {
        return smaller
    }
    else if (bigger.length != 0 && smaller.length == 0)
    {
        return bigger
    }
    else
    {
        return orderPrioritise(smaller).concat(orderPrioritise(bigger));
    }
}

arr = [234, 124, 123, 123, 123, 245, 513,  123, 124, 5643, 123, 156, 167, 157, 167, 6, 1, 5, 9, 6, 1, 10, 51, 34, 15]

console.log(orderPrioritise(arr))